import { Markup } from 'telegraf';
import { getChannel } from './channels.js';

/** Un buton dintr-o mapă de departament. `cb` = callback_data tratat în index.ts. */
export interface DeptButton {
  label: string;
  cb: string;
}

export interface Dept {
  id: string;
  num: number; // numărul funcției/diviziei din organigramă
  emoji: string;
  name: string;
  tagline: string;
  agentId: string; // directorul AI al departamentului
  buttons: DeptButton[];
}

/** Cele 7 departamente (funcțiile afacerii). Funcțiile 1-6 pot avea canal propriu. */
export const DEPARTMENTS: Dept[] = [
  {
    id: 'conducere',
    num: 7,
    emoji: '👑',
    name: 'Conducere',
    tagline: 'Strategie, decizii, coordonare',
    agentId: 'director_general',
    buttons: [
      { label: '💬 Director General', cb: 'dir:director_general' },
      { label: '📊 Statistici generale', cb: 'stats' },
    ],
  },
  {
    id: 'dezvorg',
    num: 1,
    emoji: '🧩',
    name: 'Construcție & Structurare',
    tagline: 'Angajare, training, productivitate',
    agentId: 'director_dezvorg',
    buttons: [
      { label: '💬 Director Construcție & Structurare', cb: 'dir:director_dezvorg' },
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
    tagline: 'Atragere + conversie în clienți',
    agentId: 'director_marketing',
    buttons: [
      { label: '💬 Director Marketing & Vânzări', cb: 'dir:director_marketing' },
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
    tagline: 'Gestionare + planificare bani',
    agentId: 'director_financiar',
    buttons: [
      { label: '💬 Director Financiar', cb: 'dir:director_financiar' },
      { label: '📊 Raport financiar', cb: 'stats' },
    ],
  },
  {
    id: 'productie',
    num: 4,
    emoji: '✂️',
    name: 'Producție / Serviciul',
    tagline: 'Calitate + Termen + Cost',
    agentId: 'director_operational',
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
    tagline: 'Zero erori repetate, satisfacție',
    agentId: 'director_calitate',
    buttons: [{ label: '💬 Director Calitate', cb: 'dir:director_calitate' }],
  },
  {
    id: 'pr',
    num: 6,
    emoji: '📢',
    name: 'PR & Imagine',
    tagline: 'Imaginea brandului, comunitate',
    agentId: 'director_pr',
    buttons: [{ label: '💬 Director PR', cb: 'dir:director_pr' }],
  },
];

/** Adaugă butoanele de canal (publică / leagă) în funcție de starea canalului. */
export function deptButtonsWithChannel(d: Dept, hasChannel: boolean): DeptButton[] {
  const channelBtn: DeptButton = hasChannel
    ? { label: '📢 Publică în canal', cb: `pub:${d.id}` }
    : { label: '🔗 Conectează un canal', cb: `howlink:${d.id}` };
  return [...d.buttons, channelBtn];
}

export function getDept(id: string): Dept | undefined {
  return DEPARTMENTS.find((d) => d.id === id);
}

/** Eticheta unui departament pe butonul din meniul principal. */
export function deptLabel(d: Dept): string {
  return `${d.emoji} ${d.name}`;
}

export function findDeptByLabel(label: string): Dept | undefined {
  return DEPARTMENTS.find((d) => deptLabel(d) === label);
}

/** Tastatura principală: cele 7 departamente, câte 2 pe rând. */
export function mainKeyboard() {
  const labels = DEPARTMENTS.map(deptLabel);
  const rows: string[][] = [];
  for (let i = 0; i < labels.length; i += 2) {
    rows.push(labels.slice(i, i + 2));
  }
  return Markup.keyboard(rows).resize();
}

/** Submeniul (mapa) unui departament, cu butonul de canal potrivit. */
export function deptSubmenu(d: Dept) {
  const channel = getChannel(d.id);
  const buttons = deptButtonsWithChannel(d, !!channel);
  const channelLine = channel ? `\n📢 Canal: *${channel.title}*` : '';
  return {
    text: `${d.emoji} *${d.name}*\n_${d.tagline}_${channelLine}\n\nAlege ce vrei să faci:`,
    keyboard: Markup.inlineKeyboard(buttons.map((b) => [Markup.button.callback(b.label, b.cb)])),
  };
}

/** Tastatura pentru a alege funcția când legi un canal. */
export function linkKeyboard() {
  return Markup.inlineKeyboard(
    DEPARTMENTS.map((d) => [Markup.button.callback(`${d.emoji} ${d.name}`, `link:${d.id}`)]),
  );
}
