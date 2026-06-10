import { Markup } from 'telegraf';
import { aiEnabled } from './config.js';

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
      ? '🤖 Asistentul AI este *activ* — scrie-mi liber orice (ex. _„fă-mi un plan de promovare pentru luna asta"_).'
      : '🤖 Asistentul AI este *inactiv* (lipsește cheia Claude). Comenzile și meniurile funcționează normal.',
    '',
    'Alege din meniu sau scrie /ajutor pentru lista de comenzi.',
  ].join('\n');
}

export const helpText = [
  '*Comenzi disponibile*',
  '',
  '📅 *Programări*',
  '• `/programari` — lista programărilor active',
  '• `/adauga_programare` — adaugă o programare nouă',
  '',
  '👥 *Clienți*',
  '• `/clienti` — lista clienților',
  '• `/adauga_client` — adaugă un client',
  '',
  '🎓 *Academy*',
  '• `/cursanti` — lista cursanților',
  '• `/adauga_cursant` — înscrie un cursant',
  '• `/cursuri` — cursurile disponibile',
  '',
  '📊 *Analiză*',
  '• `/statistici` — cifrele afacerii',
  '',
  '✨ *Marketing (AI)*',
  '• `/postare` — generează o postare social media',
  '• `/idei` — idei de campanii și promoții',
  '',
  '🤖 *Asistent AI*',
  '• Scrie orice întrebare liberă și îți răspund.',
  '• `/reset` — șterge contextul conversației AI',
].join('\n');
