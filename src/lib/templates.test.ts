import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { templateProblems } from "@/lib/render";

const root = path.resolve(__dirname, "../../templates");
const themes = readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory());

// Todo modelo guardado no repositório precisa poder ser publicado como está.
describe("modelos em templates/", () => {
  it.each(themes.map((theme) => theme.name))("%s passa na validação de publicação", (name) => {
    const html = readFileSync(path.join(root, name, "template.html"), "utf8");
    expect(templateProblems(html)).toEqual([]);
  });
});
