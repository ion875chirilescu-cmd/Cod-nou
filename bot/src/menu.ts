import { aiEnabled } from './config.js';
import { mainKeyboard, DEPARTMENTS } from './departments.js';

/** Meniul principal: cele 7 departamente ale afacerii. */
export const mainMenu = mainKeyboard();

export function welcome(name: string): string {
  return [
    `👋 Salut, ${name}!`,
    '',
    'Sunt *compania ta digitală* pentru *SELECT BARBER* și *SELECT ACADEMY*,',
    'organizată pe cele *7 departamente* ale afacerii. Fiecare are propriul',
    '*director AI* și funcțiile lui.',
    '',
    aiEnabled
      ? '🤖 Directorii AI sunt *activi* — pot răspunde și *acționa* pe datele reale.'
      : '🤖 AI inactiv (lipsește cheia Claude). Meniurile și funcțiile de bază merg normal.',
    '',
    'Alege un *departament* din meniul de jos. 👇',
  ].join('\n');
}

export const helpText = [
  '*Cum folosești botul*',
  '',
  'Botul e organizat pe *7 departamente*. Apasă unul din meniul de jos și',
  'se deschide *mapa* lui cu butoane:',
  '',
  ...DEPARTMENTS.map((d) => `${d.emoji} *${d.name}* — ${d.tagline}`),
  '',
  '💡 Fiecare departament are un *Director AI* care poate și *acționa*:',
  '_„adaugă o programare pentru Ion mâine la 14, tuns + barbă 90 lei"_',
  'sau _„ce restanțe avem la Academy?"_',
  '',
  'Comenzi utile: `/start` (meniu), `/anuleaza` (oprește un pas),',
  '`/misiune` (sarcini de vânzări), `/reset` (șterge conversația AI).',
  '',
  '*În grup:* `/rubrici` creează câte o rubrică (Topic) pentru fiecare funcție,',
  'cu directorul ei. `/canale` arată canalele și rubricile conectate.',
].join('\n');
