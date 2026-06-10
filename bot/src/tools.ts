import type Anthropic from '@anthropic-ai/sdk';
import { loadDb, updateDb, newId } from './db.js';
import { buildSnapshot } from './features/stats.js';
import type { Appointment, Client, Student } from './types.js';

/**
 * Uneltele pe care le poate folosi agentul AI ca să citească și să modifice
 * datele afacerii — asta îl face „deștept": chiar acționează, nu doar vorbește.
 */
export const toolDefs: Anthropic.Tool[] = [
  {
    name: 'get_stats',
    description:
      'Rezumatul afacerii: programări active/finalizate/anulate, încasări, clienți, cursanți, restanțe Academy. Folosește pentru cifre generale.',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'list_appointments',
    description:
      'Listează programările. Poți filtra după status și/sau dată. Folosește pentru întrebări despre programări concrete.',
    input_schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['confirmata', 'finalizata', 'anulata'] },
        date: { type: 'string', description: 'Dată exactă în format yyyy-mm-dd (opțional)' },
      },
    },
  },
  {
    name: 'list_clients',
    description:
      'Listează clienții (nume, telefon, vizite, total cheltuit, notițe). Parametrul „search" filtrează după nume.',
    input_schema: {
      type: 'object',
      properties: { search: { type: 'string', description: 'Text de căutat în nume (opțional)' } },
    },
  },
  {
    name: 'list_students',
    description: 'Listează cursanții Academy (nume, curs, plătit/total, status).',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'add_appointment',
    description: 'Adaugă o programare nouă. Confirmă cu utilizatorul detaliile dacă nu sunt clare.',
    input_schema: {
      type: 'object',
      properties: {
        clientName: { type: 'string' },
        service: { type: 'string' },
        barber: { type: 'string' },
        price: { type: 'number', description: 'Preț în lei' },
        date: { type: 'string', description: 'yyyy-mm-dd' },
        time: { type: 'string', description: 'HH:mm' },
        phone: { type: 'string' },
      },
      required: ['clientName', 'service', 'date', 'time', 'price'],
    },
  },
  {
    name: 'add_client',
    description: 'Adaugă un client nou în bază.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['name'],
    },
  },
  {
    name: 'add_student',
    description: 'Înscrie un cursant nou la Academy.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        course: { type: 'string' },
        totalFee: { type: 'number', description: 'Taxa totală a cursului, lei' },
        paid: { type: 'number', description: 'Cât a achitat acum, lei (implicit 0)' },
        phone: { type: 'string' },
      },
      required: ['name', 'course', 'totalFee'],
    },
  },
];

/** Etichetă scurtă afișată în Telegram cât rulează unealta. */
export function toolStatus(name: string): string {
  switch (name) {
    case 'get_stats':
      return '📊 _Verific cifrele..._';
    case 'list_appointments':
      return '📅 _Caut în programări..._';
    case 'list_clients':
      return '👥 _Caut în clienți..._';
    case 'list_students':
      return '🎓 _Caut în cursanți..._';
    case 'add_appointment':
      return '➕ _Adaug programarea..._';
    case 'add_client':
      return '➕ _Adaug clientul..._';
    case 'add_student':
      return '➕ _Înscriu cursantul..._';
    default:
      return '🔧 _Lucrez..._';
  }
}

type Input = Record<string, any>;

/** Execută o unealtă și întoarce rezultatul ca text (JSON) pentru model. */
export function runTool(name: string, input: Input): string {
  switch (name) {
    case 'get_stats':
      return JSON.stringify(buildSnapshot());

    case 'list_appointments': {
      const db = loadDb();
      let items = db.appointments;
      if (input.status) items = items.filter((a) => a.status === input.status);
      if (input.date) items = items.filter((a) => a.date === input.date);
      return JSON.stringify(
        items
          .slice(0, 50)
          .map((a) => ({
            client: a.clientName,
            service: a.service,
            barber: a.barber,
            price: a.price,
            date: a.date,
            time: a.time,
            status: a.status,
          })),
      );
    }

    case 'list_clients': {
      const db = loadDb();
      let items = db.clients;
      if (input.search) {
        const q = String(input.search).toLowerCase();
        items = items.filter((c) => c.name.toLowerCase().includes(q));
      }
      return JSON.stringify(
        items.slice(0, 50).map((c) => ({
          name: c.name,
          phone: c.phone ?? null,
          visits: c.visits,
          totalSpent: c.totalSpent,
          notes: c.notes ?? null,
        })),
      );
    }

    case 'list_students': {
      const db = loadDb();
      return JSON.stringify(
        db.students.map((s) => ({
          name: s.name,
          course: s.course,
          paid: s.paid,
          totalFee: s.totalFee,
          outstanding: s.totalFee - s.paid,
          status: s.status,
        })),
      );
    }

    case 'add_appointment': {
      if (!input.clientName || !input.service || !input.date || !input.time || input.price == null) {
        return JSON.stringify({ error: 'Lipsesc detalii: nume, serviciu, dată, oră și preț sunt obligatorii.' });
      }
      const apt: Appointment = {
        id: newId('apt'),
        clientName: String(input.clientName),
        service: String(input.service),
        barber: input.barber ? String(input.barber) : 'Nespecificat',
        price: Number(input.price),
        date: String(input.date),
        time: String(input.time),
        phone: input.phone ? String(input.phone) : undefined,
        status: 'confirmata',
        createdAt: Date.now(),
      };
      updateDb((db) => db.appointments.push(apt));
      return JSON.stringify({ ok: true, added: apt });
    }

    case 'add_client': {
      if (!input.name) return JSON.stringify({ error: 'Numele este obligatoriu.' });
      const client: Client = {
        id: newId('cli'),
        name: String(input.name),
        phone: input.phone ? String(input.phone) : undefined,
        notes: input.notes ? String(input.notes) : undefined,
        visits: 0,
        totalSpent: 0,
        createdAt: Date.now(),
      };
      updateDb((db) => db.clients.push(client));
      return JSON.stringify({ ok: true, added: client });
    }

    case 'add_student': {
      if (!input.name || !input.course || input.totalFee == null) {
        return JSON.stringify({ error: 'Nume, curs și taxa totală sunt obligatorii.' });
      }
      const student: Student = {
        id: newId('stu'),
        name: String(input.name),
        course: String(input.course),
        totalFee: Number(input.totalFee),
        paid: input.paid != null ? Number(input.paid) : 0,
        phone: input.phone ? String(input.phone) : undefined,
        status: 'activ',
        enrolledAt: Date.now(),
      };
      updateDb((db) => db.students.push(student));
      return JSON.stringify({ ok: true, added: student });
    }

    default:
      return JSON.stringify({ error: `Unealtă necunoscută: ${name}` });
  }
}
