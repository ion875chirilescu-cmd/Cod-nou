/**
 * Sursa unică de adevăr pentru organigrama „Select Barber".
 * Folosită de:  scripts/organigrama.js (SVG/PNG/HTML)  și  scripts/miroOrganigrama.js (Miro API).
 */
const C = {
  bg: '#0F0F12', surface: '#1A1A20', surfaceAlt: '#22222A',
  border: '#2A2A33', text: '#F5F5F5', muted: '#9A9AA5', gold: '#C9A24B',
};
const ACCENTS = {
  gold: '#C9A24B', teal: '#4FB3A6', blue: '#5B8DEF',
  green: '#4CAF50', purple: '#A678E0', coral: '#E07A5F',
};

const TOP = { title: 'SELECT BARBER', subtitle: 'Administrator · Proprietar' };
const MANAGER = { title: 'MANAGER', subtitle: 'Salon' };

const DEPTS = [
  { accent: ACCENTS.gold,   title: 'Frizeri & Stiliști',    desc: 'Tuns · barbă · ras cu brici · styling',
    subs: [ { t: 'Frizer Senior', d: 'Servicii premium · mentorat' },
            { t: 'Frizer Junior', d: 'Tunsori · barbă' },
            { t: 'Ucenic',        d: 'Asistență · învățare' } ] },
  { accent: ACCENTS.teal,   title: 'Recepție & Programări', desc: 'Primire clienți · rezervări · agendă',
    subs: [ { t: 'Recepționer', d: 'Întâmpinare · telefon' },
            { t: 'Casier',      d: 'Încasări · bonuri' } ] },
  { accent: ACCENTS.blue,   title: 'Marketing & Social',    desc: 'Promovare · campanii · conținut',
    subs: [ { t: 'Content & Foto-Video', d: 'Postări · reels · fotografii' } ] },
  { accent: ACCENTS.purple, title: 'Aprovizionare & Stoc',  desc: 'Produse · consumabile · furnizori', subs: [] },
  { accent: ACCENTS.green,  title: 'Igienă & Curățenie',    desc: 'Sterilizare · norme sanitare', subs: [] },
  { accent: ACCENTS.coral,  title: 'Contabilitate',         desc: 'Încasări · facturi · salarizare', subs: [] },
];

module.exports = { C, ACCENTS, TOP, MANAGER, DEPTS };
