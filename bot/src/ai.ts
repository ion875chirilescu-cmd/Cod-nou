import Anthropic from '@anthropic-ai/sdk';
import { config, aiEnabled } from './config.js';
import { buildSnapshot } from './features/stats.js';
import { AGENTS, DEFAULT_AGENT_ID, getAgent, type Agent } from './agents.js';

const client = aiEnabled ? new Anthropic({ apiKey: config.anthropicApiKey }) : null;

const MODEL = 'claude-opus-4-8';
const MAX_HISTORY = 12; // ultimele 6 schimburi (user+assistant)

type Turn = { role: 'user' | 'assistant'; content: string };

/** Istoricul conversației per chat (resetat la schimbarea agentului). */
const histories = new Map<number, Turn[]>();
/** Agentul selectat per chat. */
const selectedAgents = new Map<number, string>();

export function getSelectedAgent(chatId: number): Agent {
  return getAgent(selectedAgents.get(chatId) ?? DEFAULT_AGENT_ID);
}

export function selectAgent(chatId: number, agentId: string): Agent {
  selectedAgents.set(chatId, agentId);
  histories.delete(chatId); // conversație nouă pentru noul agent
  return getAgent(agentId);
}

export function resetHistory(chatId: number): void {
  histories.delete(chatId);
}

/** Baza comună tuturor agenților + persona specifică + context live. */
function systemPrompt(agent: Agent): string {
  return [
    `Faci parte din ECHIPA DIGITALĂ a unui antrenor și proprietar de la ${config.businessName},`,
    'o frizerie premium și o academie de frizerie din România.',
    '',
    agent.persona,
    '',
    'Reguli comune pentru toți agenții:',
    '- Răspunde mereu în limba română, pe „tu", direct și prietenos.',
    '- Fii concret și acționabil — pași clari, nu generalități.',
    '- Folosește formatare Telegram (Markdown): *îngroșat*, liste cu „•", emoji cu măsură.',
    '- Când răspunsul depinde de cifre, folosește rezumatul de business de mai jos.',
    `- Dacă o cerere ține clar de alt coleg din echipă, spune scurt pe cine să întrebe`,
    `  (${AGENTS.map((a) => `${a.name}`).join(', ')}).`,
    '',
    businessContext(),
  ].join('\n');
}

/** Rezumat live al afacerii, ca agenții să răspundă pe cifre reale. */
function businessContext(): string {
  const s = buildSnapshot();
  return [
    '── Rezumat afacere (date curente) ──',
    `Programări active: ${s.appointmentsActive} (azi: ${s.upcomingToday})`,
    `Programări finalizate: ${s.appointmentsDone}, anulate: ${s.appointmentsCancelled}`,
    `Încasări din programări finalizate: ${s.revenueDone} lei (azi: ${s.revenueToday} lei)`,
    `Clienți în bază: ${s.clientsTotal}`,
    `Cursanți activi (Academy): ${s.studentsActive}`,
    `Academy — facturat: ${s.academyBilled} lei, încasat: ${s.academyCollected} lei, restanțe: ${s.academyOutstanding} lei`,
  ].join('\n');
}

/**
 * Trimite un mesaj către agentul curent (sau unul specificat) și transmite
 * răspunsul în bucăți prin `onUpdate`. Întoarce textul final.
 */
export async function ask(
  chatId: number,
  userMessage: string,
  onUpdate?: (partial: string) => void,
  agentOverride?: Agent,
): Promise<string> {
  if (!client) {
    return '🤖 Asistentul AI nu este configurat. Adaugă „ANTHROPIC_API_KEY" în bot/.env ca să-l activezi.';
  }

  const agent = agentOverride ?? getSelectedAgent(chatId);
  const history = agentOverride ? [] : (histories.get(chatId) ?? []);
  history.push({ role: 'user', content: userMessage });

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 2000,
    thinking: { type: 'adaptive' },
    system: systemPrompt(agent),
    messages: history.map((t) => ({ role: t.role, content: t.content })),
  });

  let acc = '';
  let lastPush = 0;
  stream.on('text', (delta) => {
    acc += delta;
    const now = Date.now();
    if (onUpdate && now - lastPush > 900) {
      lastPush = now;
      onUpdate(acc);
    }
  });

  const final = await stream.finalMessage();
  const text = final.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  if (!agentOverride) {
    history.push({ role: 'assistant', content: text });
    histories.set(chatId, history.slice(-MAX_HISTORY));
  }

  return text || acc.trim();
}
