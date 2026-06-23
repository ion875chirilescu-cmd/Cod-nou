import { loadDb, updateDb } from './db.js';
import type { ChannelLink } from './types.js';

/** Leagă un canal Telegram de o funcție (departament). */
export function linkChannel(functionId: string, chatId: number, title: string): void {
  updateDb((db) => {
    db.channels[functionId] = { chatId, title };
  });
}

/** Dezleagă canalul unei funcții. */
export function unlinkChannel(functionId: string): void {
  updateDb((db) => {
    delete db.channels[functionId];
  });
}

export function getChannel(functionId: string): ChannelLink | undefined {
  return loadDb().channels[functionId];
}

export function getAllChannels(): Record<string, ChannelLink> {
  return loadDb().channels;
}
