import { Markup } from 'telegraf';

/** Un buton dintr-o mapă de departament. `cb` = callback_data tratat în index.ts. */
export interface DeptButton {
  label: string;
  cb: string;
}

export interface Dept {
  id: string;
  num: number; // numărul diviziei din organigramă
  emoji: string;
  name: string;
  tagline: string;
  buttons: DeptButton[];
}

/** Cele 7 departamente ale afacerii (organigrama clasică). */
export const DEPARTMENTS: Dept[] = [
  {
    id: 'conducere',
    num: 7,
    emoji: '👑',
    name: 'Conducere',
    tagline: 'Strategie, decizii, coordonare',
    buttons: [
      { label: '💬 Vorbește cu Directorul General', cb: 'dir:director_general' },
      { label: '📊 Statistici generale', cb: 'stats' },
    ],
  },
  {
    id: 'dezvorg',
    num: 1,
    emoji: '🧩',
    name: 'Dezvoltare Organizațională',
    tagline: 'Echipă, training, Academy',
    buttons: [
      { label: '💬 Director Dezvoltare', cb: 'dir:director_dezvorg' },
      { label: '🎓 Cursanți', cb: 'aca_students' },
      { label: '📚 Cursuri', cb: 'aca_courses' },
      { label: '➕ Înscrie cursant', cb: 'aca_add' },
    ],
  },
  {
    id: 'marketing',
    num: 2,
    emoji: '📣',
    name: 'Marketing și Vânzări',
    tagline: 'Promovare, campanii, vânzări',
    buttons: [
      { label: '💬 Director Marketing', cb: 'dir:director_marketing' },
      { label: '📣 Generează o postare', cb: 'mkt_post' },
      { label: '💡 Idei de campanii', cb: 'mkt_ideas' },
      { label: '🎟️ Misiune Masterclass', cb: 'misiune' },
      { label: '👥 Clienți', cb: 'cli_list' },
    ],
  },
  {
    id: 'finante',
    num: 3,
    emoji: '💰',
    name: 'Finanțe',
    tagline: 'Încasări, costuri, restanțe',
    buttons: [
      { label: '💬 Director Financiar', cb: 'dir:director_financiar' },
      { label: '📊 Raport financiar', cb: 'stats' },
    ],
  },
  {
    id: 'productie',
    num: 4,
    emoji: '✂️',
    name: 'Producție & Servicii',
    tagline: 'Programări, servicii, livrare',
    buttons: [
      { label: '💬 Director Operațional', cb: 'dir:director_operational' },
      { label: '📅 Programări active', cb: 'apt_list' },
      { label: '➕ Adaugă programare', cb: 'apt_add' },
      { label: '✂️ Servicii & prețuri', cb: 'services' },
    ],
  },
  {
    id: 'calitate',
    num: 5,
    emoji: '⭐',
    name: 'Calitate',
    tagline: 'Standarde, recenzii, satisfacție',
    buttons: [{ label: '💬 Director Calitate', cb: 'dir:director_calitate' }],
  },
  {
    id: 'pr',
    num: 6,
    emoji: '📢',
    name: 'PR',
    tagline: 'Imagine, parteneriate, comunitate',
    buttons: [{ label: '💬 Director PR', cb: 'dir:director_pr' }],
  },
];

/** Eticheta unui departament pe butonul din meniul principal. */
export function deptLabel(d: Dept): string {
  return `${d.emoji} ${d.name}`;
}

export function findDeptByLabel(label: string): Dept | undefined {
  return DEPARTMENTS.find((d) => deptLabel(d) === label);
}

/** Tastatura principală: cele 7 departamente, câte 2 pe rând (PR singur la final). */
export function mainKeyboard() {
  const labels = DEPARTMENTS.map(deptLabel);
  const rows: string[][] = [];
  for (let i = 0; i < labels.length; i += 2) {
    rows.push(labels.slice(i, i + 2));
  }
  return Markup.keyboard(rows).resize();
}

/** Submeniul (mapa) unui departament. */
export function deptSubmenu(d: Dept) {
  return {
    text: `${d.emoji} *${d.name}*\n_${d.tagline}_\n\nAlege ce vrei să faci:`,
    keyboard: Markup.inlineKeyboard(d.buttons.map((b) => [Markup.button.callback(b.label, b.cb)])),
  };
}
