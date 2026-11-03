// Corta uma folha de alfabeto com fundo branco em letras WebP transparentes.
// Uso: npm i --no-save playwright-core && node scripts/fatiar-alfabeto.mjs <folha.png> <pasta-de-saida>
// A folha tem oito linhas: quatro de pedra e quatro de verde, na ordem de ROWS.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";

const [sheet, output] = process.argv.slice(2);
const ROWS = ["ABCDEFGHIJKLM", "NOPQRSTUVWXYZ", "0123456789ÁÀÂÃ", "ÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜÇ"];
const STYLES = ["pedra", "verde"];
const expected = [...ROWS, ...ROWS].map((row) => row.length);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const dataUrl = `data:image/png;base64,${readFileSync(sheet).toString("base64")}`;
const glyphs = await page.evaluate(
  async ({ src, expected, rows: charRows }) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const image = ctx.getImageData(0, 0, w, h);
    const px = image.data;

    const isWhite = (i) => Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]) > 232;
    const background = new Uint8Array(w * h);
    const visited = new Uint8Array(w * h);
    for (let start = 0; start < w * h; start++) {
      if (visited[start] || !isWhite(start)) continue;
      const region = [start];
      visited[start] = 1;
      let touchesEdge = false;
      for (let n = 0; n < region.length; n++) {
        const i = region[n];
        const x = i % w;
        const y = (i / w) | 0;
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touchesEdge = true;
        for (const next of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
          if (next >= 0 && !visited[next] && isWhite(next)) {
            visited[next] = 1;
            region.push(next);
          }
        }
      }
      // Regiões pequenas são brilhos da pedra; as grandes são o fundo e os miolos das letras.
      if (touchesEdge || region.length > 60) for (const i of region) background[i] = 1;
    }

    // Borda suave: perto do fundo, o quanto o pixel clareou vira transparência.
    for (let i = 0; i < w * h; i++) {
      if (background[i]) {
        px[i * 4 + 3] = 0;
        continue;
      }
      const near =
        background[i - 1] || background[i + 1] || background[i - w] || background[i + w] ||
        background[i - 2] || background[i + 2] || background[i - 2 * w] || background[i + 2 * w];
      if (!near) continue;
      const light = Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
      if (light > 70) {
        px[i * 4 + 3] = Math.round(255 * (1 - (light - 70) / 185));
        px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = 10;
      }
    }

    const solid = (x, y) => px[(y * w + x) * 4 + 3] > 40;
    const bands = (length, filled, minGap) => {
      const found = [];
      let begin = -1;
      let gap = 0;
      for (let p = 0; p < length; p++) {
        if (filled(p)) {
          if (begin < 0) begin = p;
          gap = 0;
        } else if (begin >= 0 && ++gap >= minGap) {
          found.push([begin, p - gap]);
          begin = -1;
        }
      }
      if (begin >= 0) found.push([begin, length - 1]);
      return found;
    };

    const rows = bands(h, (y) => { for (let x = 0; x < w; x++) if (solid(x, y)) return true; return false; }, 3);
    const result = [];
    const counts = [];
    rows.forEach(([top, bottom], r) => {
      const cols = bands(w, (x) => { for (let y = top; y <= bottom; y++) if (solid(x, y)) return true; return false; }, 2);
      counts.push(cols.length);
      if (cols.length !== expected[r]) return;
      cols.forEach(([left, right], c) => {
        let y0 = bottom;
        let y1 = top;
        for (let y = top; y <= bottom; y++) {
          for (let x = left; x <= right; x++) {
            if (solid(x, y)) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
          }
        }
        const cell = document.createElement("canvas");
        cell.width = right - left + 1;
        cell.height = y1 - y0 + 1;
        cell.getContext("2d").putImageData(image, -left, -y0, left, y0, cell.width, cell.height);
        result.push({ row: r, col: c, char: [...charRows[r % charRows.length]][c], width: cell.width, height: cell.height, cell });
      });
    });
    if (counts.join() !== expected.join()) return { result: [], counts };

    // Toda letra sai em uma célula igual: 40% acima da altura das maiúsculas para o
    // acento e 20% abaixo para a cedilha. As acentuadas vieram menores na folha.
    const plain = result.filter((g) => g.row % charRows.length < 2).map((g) => g.height).sort((a, b) => a - b);
    const capHeight = plain[plain.length >> 1];
    const top = Math.round(capHeight * 0.4);
    const cellHeight = top + capHeight + Math.round(capHeight * 0.2);
    // O corpo começa na linha mais estreita entre o acento e a letra.
    const bodyHeight = (glyph) => {
      const { data } = glyph.cell.getContext("2d").getImageData(0, 0, glyph.width, glyph.height);
      let neck = 0;
      let narrowest = Infinity;
      for (let y = Math.floor(glyph.height * 0.08); y < glyph.height * 0.45; y++) {
        let filled = 0;
        for (let x = 0; x < glyph.width; x++) if (data[(y * glyph.width + x) * 4 + 3] > 40) filled++;
        if (filled < narrowest) { narrowest = filled; neck = y; }
      }
      return glyph.height - neck;
    };
    for (const glyph of result) {
      const base = glyph.char.normalize("NFD")[0];
      const same = result.find((g) => g.char === base && (g.row < charRows.length) === (glyph.row < charRows.length));
      const accented = base !== glyph.char && glyph.char !== "Ç";
      const scaleX = base === glyph.char ? 1 : Math.min(1.5, same.width / glyph.width);
      // O I é estreito demais para achar o estreitamento: usa a escala típica das outras.
      const scaleY = !accented ? scaleX : base === "I" ? 1.28 : Math.min(1.5, capHeight / bodyHeight(glyph));
      const width = Math.round(glyph.width * scaleX);
      const height = Math.round(glyph.height * scaleY);
      const y = glyph.char === "Ç" ? top : top + capHeight - height;
      const out = document.createElement("canvas");
      out.width = width;
      out.height = cellHeight;
      const context = out.getContext("2d");
      context.imageSmoothingQuality = "high";
      context.drawImage(glyph.cell, 0, y, width, height);
      glyph.url = out.toDataURL("image/webp", 0.92);
      delete glyph.cell;
    }
    return { result, counts };
  },
  { src: dataUrl, expected, rows: ROWS },
);
await browser.close();

console.log("linhas encontradas:", glyphs.counts.join(" "), "| esperadas:", expected.join(" "));
if (glyphs.counts.join() !== expected.join()) process.exit(1);

for (const glyph of glyphs.result) {
  const style = STYLES[glyph.row < ROWS.length ? 0 : 1];
  const dir = join(output, style);
  mkdirSync(dir, { recursive: true });
  const name = glyph.char.codePointAt(0).toString(16);
  writeFileSync(join(dir, `${name}.webp`), Buffer.from(glyph.url.split(",")[1], "base64"));
}
const heights = glyphs.result.map((g) => g.height);
console.log("letras:", glyphs.result.length, "altura:", Math.min(...heights), "a", Math.max(...heights));
