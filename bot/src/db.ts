import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Database } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DB_PATH = join(DATA_DIR, 'db.json');

/** Date inițiale — aceleași servicii și frizeri ca în aplicația mobilă Select Barber. */
function seed(): Database {
  return {
    appointments: [],
    clients: [],
    students: [],
    courses: [
      { id: 'c1', name: 'Curs Frizerie Începători', price: 4500, durationWeeks: 8 },
      { id: 'c2', name: 'Curs Avansați & Fade Master', price: 6000, durationWeeks: 6 },
      { id: 'c3', name: 'Workshop Barbă & Ras Clasic', price: 1500, durationWeeks: 2 },
    ],
    services: [
      { id: 's1', name: 'Tunsoare clasică', price: 60, duration: 30 },
      { id: 's2', name: 'Tuns + barbă', price: 90, duration: 45 },
      { id: 's3', name: 'Aranjat barbă', price: 40, duration: 20 },
      { id: 's4', name: 'Tuns copii', price: 45, duration: 30 },
      { id: 's5', name: 'Ras cu brici', price: 50, duration: 25 },
      { id: 's6', name: 'Styling & coafat', price: 70, duration: 35 },
    ],
    barbers: ['Andrei Popescu', 'Mihai Ionescu', 'Cristian Dumitru', 'Alexandru Radu'],
    channels: {},
    topics: {},
  };
}

let cache: Database | null = null;

export function loadDb(): Database {
  if (cache) return cache;
  if (!existsSync(DB_PATH)) {
    cache = seed();
    saveDb();
    return cache;
  }
  try {
    cache = JSON.parse(readFileSync(DB_PATH, 'utf-8')) as Database;
    // Migrare ușoară: completează câmpurile noi lipsă din bazele vechi.
    if (!cache.channels) cache.channels = {};
    if (!cache.topics) cache.topics = {};
  } catch {
    console.warn('⚠️  db.json corupt — repornesc cu date inițiale.');
    cache = seed();
    saveDb();
  }
  return cache;
}

export function saveDb(): void {
  if (!cache) return;
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(cache, null, 2), 'utf-8');
}

/** Mutează baza de date și persistă imediat. */
export function updateDb(fn: (db: Database) => void): void {
  const db = loadDb();
  fn(db);
  saveDb();
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
