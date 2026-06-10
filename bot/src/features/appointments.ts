import { Markup } from 'telegraf';
import { loadDb, updateDb, newId } from '../db.js';
import { parseNumber, parseDate, parseTime, type FlowDef } from '../flows.js';
import type { Appointment } from '../types.js';

export function listAppointments(): { text: string; keyboard?: ReturnType<typeof Markup.inlineKeyboard> } {
  const db = loadDb();
  const active = db.appointments
    .filter((a) => a.status === 'confirmata')
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  if (active.length === 0) {
    return { text: '📅 Nu există programări active.\n\nAdaugă una cu /adauga_programare.' };
  }

  const lines = ['📅 *Programări active*', ''];
  const buttons = active.slice(0, 20).map((a) => {
    lines.push(`• *${a.date} ${a.time}* — ${a.clientName}`);
    lines.push(`  ${a.service} · ${a.barber} · ${a.price} lei`);
    return [
      Markup.button.callback(`✅ ${a.time} ${a.clientName}`, `apt_done:${a.id}`),
      Markup.button.callback('❌', `apt_cancel:${a.id}`),
    ];
  });

  return {
    text: lines.join('\n'),
    keyboard: Markup.inlineKeyboard(buttons),
  };
}

export function setAppointmentStatus(id: string, status: Appointment['status']): Appointment | null {
  let updated: Appointment | null = null;
  updateDb((db) => {
    const apt = db.appointments.find((a) => a.id === id);
    if (!apt) return;
    apt.status = status;
    updated = apt;

    // La finalizare, actualizează fișa clientului (vizite + total cheltuit).
    if (status === 'finalizata') {
      const client = db.clients.find(
        (c) => c.name.toLowerCase() === apt.clientName.toLowerCase(),
      );
      if (client) {
        client.visits += 1;
        client.totalSpent += apt.price;
      }
    }
  });
  return updated;
}

export const addAppointmentFlow: FlowDef = {
  steps: [
    { prompt: '👤 *Programare nouă*\n\nNumele clientului?', key: 'clientName' },
    {
      prompt: '✂️ Ce serviciu? (ex. Tuns + barbă)',
      key: 'service',
    },
    { prompt: '💈 Care frizer?', key: 'barber' },
    { prompt: '💵 Prețul (lei)?', key: 'price', parse: parseNumber },
    { prompt: '📆 Data? (ex. 2026-06-15 sau 15.06.2026)', key: 'date', parse: parseDate },
    { prompt: '🕒 Ora? (ex. 14:30)', key: 'time', parse: parseTime },
    { prompt: '📞 Telefon? (sau „-" ca să sari)', key: 'phone', optional: true },
  ],
  finish: (data) => {
    const apt: Appointment = {
      id: newId('apt'),
      clientName: String(data.clientName),
      service: String(data.service),
      barber: String(data.barber),
      price: Number(data.price),
      date: String(data.date),
      time: String(data.time),
      phone: data.phone ? String(data.phone) : undefined,
      status: 'confirmata',
      createdAt: Date.now(),
    };
    updateDb((db) => db.appointments.push(apt));
    return `✅ Programare adăugată:\n*${apt.clientName}* — ${apt.date} ${apt.time}\n${apt.service} · ${apt.barber} · ${apt.price} lei`;
  },
};
