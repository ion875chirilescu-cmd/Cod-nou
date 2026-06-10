import Anthropic from '@anthropic-ai/sdk';
import { config, aiEnabled } from './config.js';
import { buildSnapshot } from './features/stats.js';
import { AGENTS, DEFAULT_AGENT_ID, getAgent, type Agent } from './agents.js';
import { toolDefs, runTool, toolStatus } from './tools.js';

const client = aiEnabled ? new Anthropic({ apiKey: config.anthropicApiKey }) : null;

const MODEL = 'claude-opus-4-8';
const MAX_HISTORY = 12; // ultimele 6 schimburi (user+assistant)
const MAX_TOOL_ROUNDS = 6; // câte runde de unelte într-un singur răspuns

type Turn = { role: 'user' | 'assistant'; content: string };

/** Istoricul conversației per chat (resetat la schimbarea agentului). */
const histories = new Map<number, Turn[]>();
/** Agentul selectat per chat. */
const selectedAgents = new Map<number, string>();

export function getSelectedAgent(chatId: number): Agent {
  return getAgent(selectedAgents.get(chatId) ?? DEFAULT_AGENT_ID);
}

/** Adevărat dacă acest chat și-a ales deja explicit un agent. */
export function hasSelectedAgent(chatId: number): boolean {
  return selectedAgents.has(chatId);
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
  const today = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return [
    `Faci parte din ECHIPA DIGITALĂ a unui antrenor și proprietar de la ${config.businessName},`,
    'o frizerie premium și o academie de frizerie din România.',
    `Data de azi: ${today}.`,
    '',
    agent.persona,
    '',
    'Ai UNELTE prin care poți citi și modifica datele reale ale afacerii:',
    '- citire: get_stats, list_appointments, list_clients, list_students',
    '- acțiuni: add_appointment, add_client, add_student',
    'Folosește-le din proprie inițiativă când întrebarea cere date concrete sau o acțiune.',
    'Nu inventa cifre sau nume — verifică întâi cu uneltele. La acțiuni importante,',
    'confirmă scurt ce ai făcut după ce le execuți.',
    '',
    'Reguli comune:',
    '- Răspunde mereu în limba română, pe „tu", direct și prietenos.',
    '- Fii concret și acționabil — pași clari, nu generalități.',
    '- Folosește formatare Telegram (Markdown): *îngroșat*, liste cu „•", emoji cu măsură.',
    `- Dacă o cerere ține clar de alt coleg, spune pe cine să întrebe (${AGENTS.map((a) => a.name).join(', ')}).`,
    '',
    businessContext(),
  ].join('\n');
}

/** Rezumat rapid al afacerii (pentru context imediat; detaliile vin din unelte). */
function businessContext(): string {
  const s = buildSnapshot();
  return [
    '── Rezumat rapid (cifre curente) ──',
    `Programări active: ${s.appointmentsActive} (azi: ${s.upcomingToday}) · finalizate: ${s.appointmentsDone}`,
    `Încasări finalizate: ${s.revenueDone} lei · Clienți: ${s.clientsTotal}`,
    `Cursanți activi: ${s.studentsActive} · Restanțe Academy: ${s.academyOutstanding} lei`,
  ].join('\n');
}

/**
 * Trimite mesajul către agent, lăsându-l să folosească unelte (buclă agentică).
 * `onUpdate` primește mesaje de stare (ex. „caut în programări...") cât lucrează.
 * Întoarce textul final.
 */
export async function ask(
  chatId: number,
  userMessage: string,
  onUpdate?: (partial: string) => void,
  agentOverride?: Agent,
): Promise<string> {
  if (!client) {
    return '🤖 Asistentul AI nu este configurat. Adaugă „ANTHROPIC_API_KEY" ca să-l activezi.';
  }

  const agent = agentOverride ?? getSelectedAgent(chatId);
  const history = agentOverride ? [] : histories.get(chatId) ?? [];

  // Mesajele pentru API (pot crește cu blocuri tool_use / tool_result în această rundă).
  const messages: Anthropic.MessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.content }) as Anthropic.MessageParam),
    { role: 'user', content: userMessage },
  ];

  let finalText = '';

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2500,
      thinking: { type: 'adaptive' },
      system: systemPrompt(agent),
      tools: toolDefs,
      messages,
    });

    finalText = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    if (response.stop_reason !== 'tool_use') break;

    // Modelul vrea să folosească unelte: execută-le și trimite rezultatele înapoi.
    const toolUses = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    );
    if (onUpdate && toolUses[0]) onUpdate(toolStatus(toolUses[0].name));

    messages.push({ role: 'assistant', content: response.content });
    messages.push({
      role: 'user',
      content: toolUses.map((tu) => ({
        type: 'tool_result' as const,
        tool_use_id: tu.id,
        content: runTool(tu.name, (tu.input ?? {}) as Record<string, any>),
      })),
    });
  }

  if (!agentOverride) {
    history.push({ role: 'user', content: userMessage });
    history.push({ role: 'assistant', content: finalText });
    histories.set(chatId, history.slice(-MAX_HISTORY));
  }

  return finalText;
}
