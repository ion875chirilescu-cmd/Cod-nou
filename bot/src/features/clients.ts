import { loadDb, updateDb, newId } from '../db.js';
import type { FlowDef } from '../flows.js';
import type { Client } from '../types.js';

export function listClients(): string {
  const db = loadDb();
  if (db.clients.length === 0) {
    return '👥 Niciun client în bază.\n\nAdaugă unul cu /adauga_client.';
  }
  const sorted = [...db.clients].sort((a, b) => b.totalSpent - a.totalSpent);
  const lines = ['👥 *Clienți* (după total cheltuit)', ''];
  for (const c of sorted.slice(0, 30)) {
    const phone = c.phone ? ` · 📞 ${c.phone}` : '';
    lines.push(`• *${c.name}* — ${c.visits} vizite · ${c.totalSpent} lei${phone}`);
    if (c.notes) lines.push(`  _${c.notes}_`);
  }
  return lines.join('\n');
}

export const addClientFlow: FlowDef = {
  steps: [
    { prompt: '👤 *Client nou*\n\nNumele clientului?', key: 'name' },
    { prompt: '📞 Telefon? (sau „-")', key: 'phone', optional: true },
    { prompt: '📝 Notițe? (preferințe, alergii etc. — sau „-")', key: 'notes', optional: true },
  ],
  finish: (data) => {
    const client: Client = {
      id: newId('cli'),
      name: String(data.name),
      phone: data.phone ? String(data.phone) : undefined,
      notes: data.notes ? String(data.notes) : undefined,
      visits: 0,
      totalSpent: 0,
      createdAt: Date.now(),
    };
    updateDb((db) => db.clients.push(client));
    return `✅ Client adăugat: *${client.name}*`;
  },
};
