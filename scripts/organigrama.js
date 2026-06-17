/**
 * Generator organigramă „Select Barber".
 * Produce: organigrama.svg + organigrama.png (temă dark + auriu, ca aplicația).
 *
 * Rulare:  node scripts/organigrama.js
 */
const fs = require('fs');
const path = require('path');

// ─── Paletă (aceeași ca preview.html / src/theme) ───────────────────────────
const C = {
  bg: '#0F0F12', surface: '#1A1A20', surfaceAlt: '#22222A',
  border: '#2A2A33', text: '#F5F5F5', muted: '#9A9AA5', gold: '#C9A24B',
};
const ACCENTS = {
  gold: '#C9A24B', teal: '#4FB3A6', blue: '#5B8DEF',
  green: '#4CAF50', purple: '#A678E0', coral: '#E07A5F',
};

const W = 1480, H = 680;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Împarte un text în linii după un nr. aproximativ de caractere. */
function wrap(text, max) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) { if (line) lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

const parts = [];
const add = (s) => parts.push(s);

function rrect(x, y, w, h, r, fill, stroke, sw = 1) {
  add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}/>`);
}
function text(x, y, str, { size = 13, fill = C.text, weight = 400, anchor = 'start', spacing = 0 } = {}) {
  add(`<text x="${x}" y="${y}" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ''}>${esc(str)}</text>`);
}
function line(x1, y1, x2, y2, color = C.border, sw = 1.5) {
  add(`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="${sw}" fill="none"/>`);
}

/** Card de departament: stripe colorat sus, titlu colorat, descriere muted. */
function deptCard(x, y, w, h, accent, title, desc) {
  rrect(x, y, w, h, 12, C.surface, C.border);
  add(`<path d="M${x + 12} ${y} h${w - 24} a12 12 0 0 1 12 12 v6 h-${w} v-6 a12 12 0 0 1 12 -12 z" fill="${accent}"/>`);
  const cx = x + w / 2;
  text(cx, y + 38, title, { size: 14.5, weight: 700, fill: C.text, anchor: 'middle' });
  wrap(desc, 30).forEach((ln, i) => text(cx, y + 58 + i * 16, ln, { size: 11.5, fill: C.muted, anchor: 'middle' }));
}

/** Sub-rol (cutie mică). */
function subCard(x, y, w, h, accent, title, desc) {
  rrect(x, y, w, h, 9, C.surfaceAlt, C.border);
  add(`<rect x="${x}" y="${y + 9}" width="4" height="${h - 18}" rx="2" fill="${accent}"/>`);
  text(x + 14, y + 21, title, { size: 12.5, weight: 700, fill: C.text });
  if (desc) text(x + 14, y + 38, desc, { size: 10.5, fill: C.muted });
}

// ─── Date organigramă ───────────────────────────────────────────────────────
const DEPTS = [
  { accent: ACCENTS.gold,   title: 'Frizeri & Stiliști',     desc: 'Tuns · barbă · ras cu brici · styling',
    subs: [ { t: 'Frizer Senior', d: 'Servicii premium · mentorat' },
            { t: 'Frizer Junior', d: 'Tunsori · barbă' },
            { t: 'Ucenic',        d: 'Asistență · învățare' } ] },
  { accent: ACCENTS.teal,   title: 'Recepție & Programări',  desc: 'Primire clienți · rezervări · agendă',
    subs: [ { t: 'Recepționer', d: 'Întâmpinare · telefon' },
            { t: 'Casier',      d: 'Încasări · bonuri' } ] },
  { accent: ACCENTS.blue,   title: 'Marketing & Social',     desc: 'Promovare · campanii · conținut',
    subs: [ { t: 'Content & Foto-Video', d: 'Postări · reels · fotografii' } ] },
  { accent: ACCENTS.purple, title: 'Aprovizionare & Stoc',   desc: 'Produse · consumabile · furnizori', subs: [] },
  { accent: ACCENTS.green,  title: 'Igienă & Curățenie',     desc: 'Sterilizare · norme sanitare', subs: [] },
  { accent: ACCENTS.coral,  title: 'Contabilitate',          desc: 'Încasări · facturi · salarizare', subs: [] },
];

// ─── Layout ─────────────────────────────────────────────────────────────────
const DW = 212, DH = 84, GAP = 18;
const totalW = DEPTS.length * DW + (DEPTS.length - 1) * GAP;
const startX = (W - totalW) / 2;
const deptX = (i) => startX + i * (DW + GAP);
const deptCX = (i) => deptX(i) + DW / 2;

const topY = 96, topW = 360, topH = 70, topX = (W - topW) / 2, topCX = W / 2;
const hexCY = 230, hexR = 48;
const busY = 300, deptY = 332;

// ─── Desen ──────────────────────────────────────────────────────────────────
rrect(0, 0, W, H, 0, C.bg);
// titlu colț stânga-sus (ca în model)
text(40, 56, 'Organigrama — Select Barber', { size: 22, weight: 800, fill: C.gold, spacing: 0.5 });
text(40, 78, 'Structură organizatorică', { size: 13, fill: C.muted });

// conector top → hexagon
line(topCX, topY + topH, topCX, hexCY - hexR);
// conector hexagon → bus
line(topCX, hexCY + hexR, topCX, busY);
// bus orizontal peste departamente
line(deptCX(0), busY, deptCX(DEPTS.length - 1), busY, C.border, 1.5);
// drop-uri la fiecare departament
DEPTS.forEach((_, i) => line(deptCX(i), busY, deptCX(i), deptY));

// departamente + sub-roluri
DEPTS.forEach((d, i) => {
  const x = deptX(i), cx = deptCX(i);
  deptCard(x, deptY, DW, DH, d.accent, d.title, d.desc);

  if (d.subs.length) {
    const SW = 196, SH = 46, SGAP = 14;
    const subX = cx - 18;                 // indentat la dreapta față de spine
    const spineX = cx;                    // spine pe centrul departamentului
    const firstTop = deptY + DH + 22;
    // spine vertical
    const lastMid = firstTop + (d.subs.length - 1) * (SH + SGAP) + SH / 2;
    line(spineX, deptY + DH, spineX, lastMid, C.border, 1.5);
    d.subs.forEach((s, j) => {
      const sy = firstTop + j * (SH + SGAP);
      const mid = sy + SH / 2;
      line(spineX, mid, subX, mid, C.border, 1.5);   // stub orizontal
      subCard(subX, sy, SW, SH, d.accent, s.t, s.d);
    });
  }
});

// top box (negru, ca în model)
rrect(topX, topY, topW, topH, 14, '#000000', C.gold, 1.5);
text(topCX, topY + 30, 'SELECT BARBER', { size: 19, weight: 800, fill: C.gold, anchor: 'middle', spacing: 2 });
text(topCX, topY + 52, 'Administrator · Proprietar', { size: 12.5, fill: '#D8C892', anchor: 'middle' });

// hexagon (Manager)
const hx = topCX, hy = hexCY, r = hexR;
const hex = [];
for (let k = 0; k < 6; k++) { const a = Math.PI / 180 * (60 * k - 90); hex.push(`${(hx + r * Math.cos(a)).toFixed(1)},${(hy + r * Math.sin(a) * 0.82).toFixed(1)}`); }
add(`<polygon points="${hex.join(' ')}" fill="${C.surfaceAlt}" stroke="${C.gold}" stroke-width="2"/>`);
text(hx, hy - 4, 'MANAGER', { size: 13, weight: 800, fill: C.gold, anchor: 'middle' });
text(hx, hy + 13, 'Salon', { size: 11.5, fill: C.muted, anchor: 'middle' });

// legendă jos
const ly = H - 40;
text(40, ly, 'Niveluri:', { size: 12, weight: 700, fill: C.muted });
['Conducere', 'Departamente', 'Sub-roluri'].forEach((t, i) => {
  const lx = 120 + i * 150;
  rrect(lx, ly - 11, 14, 14, 3, i === 0 ? '#000' : i === 1 ? C.surface : C.surfaceAlt, C.gold, 1);
  text(lx + 22, ly, t, { size: 12, fill: C.muted });
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${parts.join('\n')}\n</svg>`;

const outDir = path.resolve(__dirname, '..');
fs.writeFileSync(path.join(outDir, 'organigrama.svg'), svg);
console.log('✓ organigrama.svg');

// HTML interactiv (înglobează SVG-ul, scalabil, aceeași temă)
const html = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Select Barber — Organigramă</title>
<style>
  :root{--bg:${C.bg};--surface:${C.surface};--primary:${C.gold};--text:${C.text};--muted:${C.muted};--border:${C.border}}
  *{box-sizing:border-box}
  body{margin:0;background:#08080a;color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:24px 16px 48px}
  .wrap{max-width:1480px;margin:0 auto}
  .top{text-align:center;margin-bottom:18px}
  .top h1{color:var(--primary);letter-spacing:2px;margin:6px 0 4px;font-size:22px}
  .top p{color:var(--muted);margin:0;font-size:13px}
  .frame{background:var(--bg);border:1px solid var(--border);border-radius:18px;
    padding:10px;overflow:auto;box-shadow:0 18px 50px rgba(0,0,0,.5)}
  svg.org{display:block;width:100%;height:auto;min-width:900px}
  .note{color:var(--muted);font-size:12px;text-align:center;margin-top:14px}
  .note a{color:var(--primary);text-decoration:none}
</style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <h1>💈 SELECT BARBER</h1>
      <p>Organigramă — structură organizatorică</p>
    </div>
    <div class="frame">
      ${svg.replace('<svg ', '<svg class="org" ')}
    </div>
    <p class="note">Generată cu <code>scripts/organigrama.js</code> · variantă imagine: <a href="organigrama.png">organigrama.png</a></p>
  </div>
</body>
</html>`;
fs.writeFileSync(path.join(outDir, 'organigrama.html'), html);
console.log('✓ organigrama.html');

// PNG via resvg (dacă renderer-ul e disponibil)
try {
  let Resvg;
  for (const p of ['@resvg/resvg-js', '/tmp/node_modules/@resvg/resvg-js']) {
    try { Resvg = require(p).Resvg; break; } catch (_) {}
  }
  if (!Resvg) throw new Error('@resvg/resvg-js negăsit');
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 2200 } }).render().asPng();
  fs.writeFileSync(path.join(outDir, 'organigrama.png'), png);
  console.log('✓ organigrama.png');
} catch (e) { console.error('PNG skip (instalează @resvg/resvg-js):', e.message); }
