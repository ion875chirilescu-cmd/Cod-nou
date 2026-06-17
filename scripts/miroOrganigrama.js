/**
 * Creează organigrama „Select Barber" în Miro ca forme NATIVE + conectori
 * (editabile, mutabile), folosind Miro REST API v2.
 *
 * ── Necesită un token Miro ──────────────────────────────────────────────────
 *   1. Intră pe https://miro.com/app/settings/user-profile/apps  → „Create new app".
 *   2. La permisiuni (scopes) bifează:  boards:read  și  boards:write.
 *   3. „Install app and get OAuth token" → instaleaz-o în team-ul tău și copiază
 *      access token-ul (începe de obicei cu „eyJ...").
 *
 * ── Rulare ──────────────────────────────────────────────────────────────────
 *   export MIRO_ACCESS_TOKEN="token-ul-tău"
 *   # opțional, ca să scrii într-un board existent (altfel creează unul nou):
 *   export MIRO_BOARD_ID="xxxxxxxxxxx"
 *   node scripts/miroOrganigrama.js
 *
 * La final afișează link-ul board-ului (viewLink).
 */
const { C, TOP, MANAGER, DEPTS } = require('./orgData');

const TOKEN = process.env.MIRO_ACCESS_TOKEN || process.env.MIRO_TOKEN;
const BOARD_ID_ENV = process.env.MIRO_BOARD_ID;
const BOARD_NAME = process.env.MIRO_BOARD_NAME || 'Select Barber — Organigramă';
const API = 'https://api.miro.com/v2';

if (!TOKEN) {
  console.error(`
✗ Lipsește token-ul Miro.

  Setează variabila de mediu și reia:
    export MIRO_ACCESS_TOKEN="token-ul-tău"
    node scripts/miroOrganigrama.js

  Token de aici: https://miro.com/app/settings/user-profile/apps
  (creează o app cu scopes  boards:read  +  boards:write,  apoi „get OAuth token").
`);
  process.exit(1);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await res.text();
  let json; try { json = txt ? JSON.parse(txt) : {}; } catch { json = { raw: txt }; }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(json)}`);
  }
  await sleep(120); // ușor throttling pentru rate-limit
  return json;
}

/** Creează o formă și întoarce id-ul. */
async function shape({ x, y, w, h, type = 'round_rectangle', title, desc, fill, border, textColor, fontSize = 14, borderWidth = 2 }) {
  const content = desc
    ? `<p><strong>${esc(title)}</strong><br>${esc(desc)}</p>`
    : `<p><strong>${esc(title)}</strong></p>`;
  const r = await api('POST', `/boards/${BOARD_ID}/shapes`, {
    data: { content, shape: type },
    style: {
      fillColor: fill, fillOpacity: '1',
      borderColor: border, borderWidth: String(borderWidth), borderOpacity: '1',
      color: textColor, fontSize: String(fontSize), textAlign: 'center', textAlignVertical: 'middle',
    },
    position: { x, y, origin: 'center' },
    geometry: { width: w, height: h },
  });
  return r.id;
}

async function connect(fromId, toId, color = C.border) {
  await api('POST', `/boards/${BOARD_ID}/connectors`, {
    startItem: { id: fromId },
    endItem: { id: toId },
    shape: 'elbowed',
    style: { strokeColor: color, strokeWidth: '2', strokeStyle: 'normal', startStrokeCap: 'none', endStrokeCap: 'none' },
  });
}

// ─── Layout (coordonate Miro, origin = centru) ──────────────────────────────
const DW = 240, DH = 110, DGAP = 50, DSTEP = DW + DGAP;
const totalW = DEPTS.length * DW + (DEPTS.length - 1) * DGAP;
const deptX = (i) => -totalW / 2 + DW / 2 + i * DSTEP;
const DEPT_Y = 470;
const SUB_W = 230, SUB_H = 84, SUB_FIRST_Y = 590, SUB_STEP = 110;

let BOARD_ID;

(async () => {
  // 1. Board
  if (BOARD_ID_ENV) {
    BOARD_ID = BOARD_ID_ENV;
    console.log(`→ Folosesc board-ul existent ${BOARD_ID}`);
  } else {
    const b = await api('POST', '/boards', { name: BOARD_NAME, description: 'Organigramă generată automat' });
    BOARD_ID = b.id;
    console.log(`✓ Board nou creat: ${BOARD_ID}`);
  }

  // 2. Top (Administrator / Proprietar)
  const topId = await shape({
    x: 0, y: 0, w: 380, h: 96, type: 'round_rectangle',
    title: TOP.title, desc: TOP.subtitle,
    fill: '#000000', border: C.gold, textColor: C.gold, fontSize: 18, borderWidth: 2,
  });
  console.log('  • Top');

  // 3. Manager (hexagon)
  const mgrId = await shape({
    x: 0, y: 210, w: 160, h: 140, type: 'hexagon',
    title: MANAGER.title, desc: MANAGER.subtitle,
    fill: C.surfaceAlt, border: C.gold, textColor: C.gold, fontSize: 14, borderWidth: 2,
  });
  await connect(topId, mgrId, C.gold);
  console.log('  • Manager');

  // 4. Departamente + sub-roluri
  for (let i = 0; i < DEPTS.length; i++) {
    const d = DEPTS[i];
    const dx = deptX(i);
    const deptId = await shape({
      x: dx, y: DEPT_Y, w: DW, h: DH, type: 'round_rectangle',
      title: d.title, desc: d.desc,
      fill: C.surface, border: d.accent, textColor: C.text, fontSize: 14, borderWidth: 3,
    });
    await connect(mgrId, deptId);
    console.log(`  • ${d.title}`);

    for (let j = 0; j < d.subs.length; j++) {
      const s = d.subs[j];
      const subId = await shape({
        x: dx, y: SUB_FIRST_Y + j * SUB_STEP, w: SUB_W, h: SUB_H, type: 'round_rectangle',
        title: s.t, desc: s.d,
        fill: C.surfaceAlt, border: d.accent, textColor: C.text, fontSize: 12, borderWidth: 2,
      });
      await connect(deptId, subId, d.accent);
      console.log(`      ↳ ${s.t}`);
    }
  }

  // 5. Link
  try {
    const info = await api('GET', `/boards/${BOARD_ID}`);
    console.log(`\n✓ Gata! Deschide board-ul:\n  ${info.viewLink || `https://miro.com/app/board/${BOARD_ID}/`}`);
  } catch {
    console.log(`\n✓ Gata! Board: https://miro.com/app/board/${BOARD_ID}/`);
  }
})().catch((e) => { console.error('\n✗ Eroare:', e.message); process.exit(1); });
