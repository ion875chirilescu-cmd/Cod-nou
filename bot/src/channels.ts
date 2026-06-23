import { loadDb, updateDb } from './db.js';
import type { ChannelLink, TopicLink } from './types.js';

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

// ── Rubrici (topics) dintr-un grup-forum ──

export function setTopic(functionId: string, chatId: number, threadId: number, name: string): void {
  updateDb((db) => {
    db.topics[functionId] = { chatId, threadId, name };
  });
}

export function getTopic(functionId: string): TopicLink | undefined {
  return loadDb().topics[functionId];
}

export function getAllTopics(): Record<string, TopicLink> {
  return loadDb().topics;
}

/** Găsește funcția căreia îi aparține o rubrică (după grup + thread). */
export function getTopicFunction(chatId: number, threadId: number): string | undefined {
  const topics = loadDb().topics;
  for (const [fnId, t] of Object.entries(topics)) {
    if (t.chatId === chatId && t.threadId === threadId) return fnId;
  }
  return undefined;
}

