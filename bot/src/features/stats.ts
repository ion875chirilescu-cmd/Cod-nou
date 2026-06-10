import type { Database } from '../types.js';
import { loadDb } from '../db.js';

export interface BusinessSnapshot {
  appointmentsActive: number;
  appointmentsDone: number;
  appointmentsCancelled: number;
  revenueDone: number; // încasări din programări finalizate
  revenueToday: number;
  upcomingToday: number;
  clientsTotal: number;
  studentsActive: number;
  academyBilled: number; // taxe totale ale cursanților activi/absolviți
  academyCollected: number; // cât s-a încasat efectiv
  academyOutstanding: number; // restanțe
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function buildSnapshot(db: Database = loadDb()): BusinessSnapshot {
  const today = todayIso();
  const done = db.appointments.filter((a) => a.status === 'finalizata');
  const active = db.appointments.filter((a) => a.status === 'confirmata');

  const academyRelevant = db.students.filter((s) => s.status !== 'retras');
  const academyBilled = academyRelevant.reduce((sum, s) => sum + s.totalFee, 0);
  const academyCollected = academyRelevant.reduce((sum, s) => sum + s.paid, 0);

  return {
    appointmentsActive: active.length,
    appointmentsDone: done.length,
    appointmentsCancelled: db.appointments.filter((a) => a.status === 'anulata').length,
    revenueDone: done.reduce((sum, a) => sum + a.price, 0),
    revenueToday: done.filter((a) => a.date === today).reduce((sum, a) => sum + a.price, 0),
    upcomingToday: active.filter((a) => a.date === today).length,
    clientsTotal: db.clients.length,
    studentsActive: db.students.filter((s) => s.status === 'activ').length,
    academyBilled,
    academyCollected,
    academyOutstanding: academyBilled - academyCollected,
  };
}

export function formatStats(): string {
  const s = buildSnapshot();
  const lei = (n: number) => `${n.toLocaleString('ro-RO')} lei`;

  return [
    '📊 *Statistici SELECT*',
    '',
    '💈 *Frizerie*',
    `• Programări active: *${s.appointmentsActive}*`,
    `• Programări azi: *${s.upcomingToday}*`,
    `• Finalizate: *${s.appointmentsDone}*  |  Anulate: *${s.appointmentsCancelled}*`,
    `• Încasări finalizate: *${lei(s.revenueDone)}*`,
    `• Încasări azi: *${lei(s.revenueToday)}*`,
    `• Clienți în bază: *${s.clientsTotal}*`,
    '',
    '🎓 *Academy*',
    `• Cursanți activi: *${s.studentsActive}*`,
    `• Taxe facturate: *${lei(s.academyBilled)}*`,
    `• Încasat: *${lei(s.academyCollected)}*`,
    `• Restanțe: *${lei(s.academyOutstanding)}*`,
  ].join('\n');
}
