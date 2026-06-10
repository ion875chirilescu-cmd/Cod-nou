import { Markup } from 'telegraf';
import { aiEnabled } from './config.js';

/** Meniul principal (butoane permanente jos). Fiecare deschide o „mapă". */
export const mainMenu = Markup.keyboard([
  ['📅 Programări', '👥 Clienți'],
  ['🎓 Academy', '📊 Statistici'],
  ['✨ Marketing', '🤖 Asistent AI'],
]).resize();

export function welcome(name: string): string {
  return [
    `👋 Salut, ${name}!`,
    '',
    'Sunt *echipa ta digitală* pentru *SELECT BARBER* și *SELECT ACADEMY*.',
    'Te ajut să conduci și să dezvolți afacerea — programări, clienți,',
    'cursanți, cifre și marketing, toate într-un singur loc.',
    '',
    aiEnabled
      ? '🤖 Asistentul AI este *activ*. Apasă un buton din meniu sau scrie-mi liber.'
      : '🤖 Asistentul AI este *inactiv* (lipsește cheia Claude). Comenzile și meniurile funcționează normal.',
    '',
    'Alege o *mapă* din meniul de jos. 👇',
  ].join('\n');
}

// ── „Mapele" — submeniuri cu butoane pentru fiecare funcție ──

export const appointmentsMenu = {
  text: '📅 *Programări*\n\nAlege ce vrei să faci:',
  keyboard: Markup.inlineKeyboard([
    [Markup.button.callback('➕ Adaugă programare', 'apt_add')],
    [Markup.button.callback('📋 Vezi programările active', 'apt_list')],
  ]),
};

export const clientsMenu = {
  text: '👥 *Clienți*\n\nAlege ce vrei să faci:',
  keyboard: Markup.inlineKeyboard([
    [Markup.button.callback('➕ Adaugă client', 'cli_add')],
    [Markup.button.callback('📋 Vezi lista de clienți', 'cli_list')],
  ]),
};

export const academyMenu = {
  text: '🎓 *Academy*\n\nAlege ce vrei să faci:',
  keyboard: Markup.inlineKeyboard([
    [Markup.button.callback('➕ Înscrie un cursant', 'aca_add')],
    [Markup.button.callback('👨‍🎓 Vezi cursanții', 'aca_students')],
    [Markup.button.callback('📚 Vezi cursurile', 'aca_courses')],
  ]),
};

export const marketingMenu = {
  text: '✨ *Marketing*\n\nCe să-ți pregătesc?',
  keyboard: Markup.inlineKeyboard([
    [Markup.button.callback('📣 Generează o postare', 'mkt_post')],
    [Markup.button.callback('💡 Idei de campanii', 'mkt_ideas')],
  ]),
};

export const helpText = [
  '*Cum folosești botul*',
  '',
  'Cel mai simplu: apasă butoanele din meniul de jos. Fiecare deschide o',
  '„mapă" cu opțiunile ei.',
  '',
  '📅 *Programări* — adaugă / vezi programări',
  '👥 *Clienți* — adaugă / vezi clienți',
  '🎓 *Academy* — cursanți și cursuri',
  '📊 *Statistici* — cifrele afacerii',
  '✨ *Marketing* — postări și idei (AI)',
  '🤖 *Asistent AI* — alegi un agent și scrii liber',
  '',
  'Comenzi utile: `/start` (meniu), `/anuleaza` (oprește un pas), `/reset`',
  '(șterge conversația AI).',
].join('\n');
