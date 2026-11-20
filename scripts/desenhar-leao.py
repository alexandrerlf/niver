# Desenha o Leo, mascote da variante B da página de apresentação.
# Uso: python3 scripts/desenhar-leao.py public/brand/b
import math, sys, os
OUT="#3b2410"
MANE="#f07f1d"; MANE_D="#d8630f"; MANE_L="#f79a3a"
FUR="#f8b443"; FUR_L="#fcd27a"; MUZ="#fde7bd"; PINK="#f39a8e"
PURPLE="#6636c3"; PURPLE_D="#4f24a3"; YELLOW="#ffd34e"; BLUE="#3d7fd9"; BLUE_D="#2b63b8"

def star(cx, cy, r, rot=0, fill=YELLOW, stroke=None, sw=0):
    pts=[]
    for i in range(10):
        a=math.radians(rot-90+36*i); rr=r if i%2==0 else r*0.48
        pts.append(f"{cx+rr*math.cos(a):.1f},{cy+rr*math.sin(a):.1f}")
    s=f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"{s}/>'

def mane(cx, cy, rx, ry, n, size, fill, rot0=0):
    out=[]
    for i in range(n):
        a=math.radians(rot0+360*i/n)
        x=cx+rx*math.cos(a); y=cy+ry*math.sin(a)
        deg=math.degrees(a)+90
        out.append(f'<path transform="translate({x:.1f} {y:.1f}) rotate({deg:.1f})" d="M{-size*0.62:.1f} {size*0.35:.1f} C{-size*0.7:.1f} {-size*0.4:.1f} {-size*0.15:.1f} {-size*1.0:.1f} 0 {-size*1.08:.1f} C{size*0.15:.1f} {-size*1.0:.1f} {size*0.7:.1f} {-size*0.4:.1f} {size*0.62:.1f} {size*0.35:.1f} Z" fill="{fill}"/>')
    return "\n".join(out)

def head(cx, cy, scale=1.0, hat=True):
    g=[f'<g transform="translate({cx} {cy}) scale({scale})">']
    g.append(mane(0, 6, 96, 90, 14, 40, MANE_D, 6))
    g.append(mane(0, 4, 88, 82, 14, 38, MANE, 19))
    g.append(f'<ellipse cx="0" cy="4" rx="104" ry="96" fill="{MANE}"/>')
    g.append(f'<path d="M-54 -74 C-60 -118 -6 -128 8 -100 C18 -126 64 -124 64 -88 C82 -98 92 -78 82 -62 Z" fill="{MANE_L}"/>')
    for sx in (-1, 1):
        g.append(f'<circle cx="{sx*76}" cy="-56" r="27" fill="{FUR}" stroke="{MANE_D}" stroke-width="4"/>')
        g.append(f'<circle cx="{sx*76}" cy="-54" r="15" fill="{PINK}"/>')
    g.append(f'<path d="M-88 -8 C-92 -72 -44 -92 0 -92 C44 -92 92 -72 88 -8 C86 48 50 88 0 88 C-50 88 -86 48 -88 -8 Z" fill="{FUR}"/>')
    g.append(f'<ellipse cx="-56" cy="30" rx="24" ry="16" fill="{FUR_L}" opacity=".7"/><ellipse cx="56" cy="30" rx="24" ry="16" fill="{FUR_L}" opacity=".7"/>')
    g.append(f'<path d="M-40 -92 C-30 -66 -2 -62 6 -80 C16 -58 46 -62 52 -88 C30 -100 -18 -102 -40 -92 Z" fill="{MANE}"/>')
    g.append(f'<path d="M-60 -38 Q-42 -52 -24 -40" fill="none" stroke="{MANE_D}" stroke-width="7" stroke-linecap="round"/>')
    g.append(f'<path d="M24 -40 Q42 -52 60 -38" fill="none" stroke="{MANE_D}" stroke-width="7" stroke-linecap="round"/>')
    for sx in (-1, 1):
        x=sx*40
        g.append(f'<ellipse cx="{x}" cy="-6" rx="21" ry="24" fill="#fff" stroke="{OUT}" stroke-width="4"/>')
        g.append(f'<ellipse cx="{x+sx*2}" cy="-2" rx="14" ry="17" fill="#5a3214"/>')
        g.append(f'<ellipse cx="{x+sx*2}" cy="-1" rx="8.5" ry="10.5" fill="#1f1209"/>')
        g.append(f'<circle cx="{x+sx*2+6}" cy="-10" r="5.5" fill="#fff"/><circle cx="{x+sx*2-5}" cy="5" r="2.4" fill="#fff"/>')
    g.append(f'<ellipse cx="0" cy="40" rx="48" ry="34" fill="{MUZ}"/>')
    g.append(f'<path d="M-16 18 C-16 8 16 8 16 18 C16 29 6 35 0 35 C-6 35 -16 29 -16 18 Z" fill="#6b3a1c"/>')
    g.append(f'<ellipse cx="-5" cy="16" rx="6" ry="3.5" fill="#fff" opacity=".55"/>')
    g.append(f'<path d="M-29 46 C-25 80 25 80 29 46 C13 53 -13 53 -29 46 Z" fill="#8a2a26" stroke="{OUT}" stroke-width="4" stroke-linejoin="round"/>')
    g.append(f'<path d="M-13 68 C-9 59 9 59 13 68 C7 74 -7 74 -13 68 Z" fill="#f2777a"/>')
    g.append(f'<path d="M-4 35 L0 45 L4 35" fill="none" stroke="#6b3a1c" stroke-width="3" stroke-linecap="round"/>')
    if hat:
        g.append('<g transform="translate(-6 -128) rotate(-4)">')
        g.append(f'<path d="M-40 10 L0 -84 L40 10 Z" fill="{BLUE}" stroke="{BLUE_D}" stroke-width="4" stroke-linejoin="round"/>')
        g.append(f'<path d="M-40 10 Q0 22 40 10" fill="none" stroke="{BLUE_D}" stroke-width="5" stroke-linecap="round"/>')
        g.append(star(0, -22, 17))
        for i in range(12):
            a=math.radians(30*i)
            g.append(f'<circle cx="{9*math.cos(a):.1f}" cy="{-88+9*math.sin(a):.1f}" r="8" fill="{YELLOW}"/>')
        g.append('<circle cx="0" cy="-88" r="10" fill="#ffe17a"/></g>')
    g.append('</g>')
    return "\n".join(g)

def arm(sx):
    # Ombro -> mão espalmada, braço aberto para cima.
    x0=250+sx*78; y0=352
    hx=250+sx*188; hy=262
    g=[f'<path d="M{x0} {y0} C{x0+sx*44} {y0-6} {hx-sx*40} {hy+40} {hx} {hy}" fill="none" stroke="{FUR}" stroke-width="40" stroke-linecap="round"/>']
    g.append(f'<g transform="translate({hx} {hy}) rotate({sx*-28})">')
    g.append(f'<ellipse cx="0" cy="0" rx="28" ry="25" fill="{FUR}"/>')
    for dx,dy,r in [(-22,-18,10),(-8,-28,11),(8,-28,11),(22,-18,10),(sx*-28,8,10)]:
        g.append(f'<circle cx="{dx}" cy="{dy}" r="{r}" fill="{FUR}"/>')
    g.append(f'<ellipse cx="0" cy="2" rx="13" ry="10" fill="{FUR_L}" opacity=".8"/></g>')
    return "\n".join(g)

def body():
    g=[arm(-1), arm(1)]
    g.append(f'<path d="M172 380 C174 350 206 334 250 334 C294 334 326 350 328 380 L334 478 C298 494 202 494 166 478 Z" fill="{PURPLE}"/>')
    g.append(f'<path d="M174 372 C154 356 136 360 126 376 L146 414 C158 404 170 404 178 410 Z" fill="{PURPLE}"/>')
    g.append(f'<path d="M326 372 C346 356 364 360 374 376 L354 414 C342 404 330 404 322 410 Z" fill="{PURPLE}"/>')
    g.append(f'<path d="M216 336 Q250 358 284 336" fill="none" stroke="{PURPLE_D}" stroke-width="8" stroke-linecap="round"/>')
    g.append(star(250, 424, 38, 0, YELLOW, "#e8b52a", 3))
    return "\n".join(g)

def sparks(x, y):
    return f'<g stroke="{YELLOW}" stroke-width="10" stroke-linecap="round"><path d="M{x} {y} l6 -26"/><path d="M{x+26} {y+10} l20 -18"/><path d="M{x+34} {y+38} l26 -4"/></g>'

d=sys.argv[1]
open(os.path.join(d,"mascote-leao.svg"),"w").write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" role="img" aria-labelledby="t">
<title id="t">Leo, o leãozinho festeiro do Niver</title>
{sparks(374, 70)}
{body()}
{head(250, 228, 0.98)}
</svg>
''')
open(os.path.join(d,"leao-cabeca.svg"),"w").write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" role="img" aria-label="Leo, o leãozinho do Niver">
{head(150, 194, 0.8)}
</svg>
''')
open(os.path.join(d,"icone-leao.svg"),"w").write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<!-- Ícone da variante B: o rosto do Leo dentro do círculo central de 80% (ícone mascarável). -->
<rect width="512" height="512" fill="{PURPLE}"/>
{star(92, 100, 18, 12)}{star(430, 418, 14, -10)}
{head(256, 300, 1.02)}
</svg>
''')
