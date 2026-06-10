import type { Context } from 'telegraf';

/** Un pas dintr-un flux conversațional pas-cu-pas. */
export interface Step {
  /** Mesajul afișat utilizatorului la acest pas. */
  prompt: string;
  /** Cheia sub care se salvează răspunsul în obiectul de date. */
  key: string;
  /** Validează/transformă inputul. Întoarce { value } sau { error }. */
  parse?: (input: string) => { value: unknown } | { error: string };
  /** Dacă e true, utilizatorul poate scrie „-" ca să sară peste. */
  optional?: boolean;
}

export interface FlowDef {
  steps: Step[];
  /**
   * Apelat la final cu datele colectate și contextul.
   * Dacă întoarce un text, botul îl trimite ca mesaj de confirmare.
   * Dacă întoarce void, finalizatorul și-a trimis singur răspunsul (ex. AI).
   */
  finish: (
    data: Record<string, unknown>,
    ctx: Context,
  ) => string | void | Promise<string | void>;
}

interface ActiveFlow {
  def: FlowDef;
  stepIndex: number;
  data: Record<string, unknown>;
}

const active = new Map<number, ActiveFlow>();

export function hasFlow(chatId: number): boolean {
  return active.has(chatId);
}

export function cancelFlow(chatId: number): void {
  active.delete(chatId);
}

/** Pornește un flux și trimite primul prompt. */
export async function startFlow(ctx: Context, chatId: number, def: FlowDef): Promise<void> {
  active.set(chatId, { def, stepIndex: 0, data: {} });
  await ctx.reply(`${def.steps[0].prompt}\n\n_Scrie /anuleaza ca să renunți._`, {
    parse_mode: 'Markdown',
  });
}

/**
 * Procesează un mesaj text în contextul fluxului activ.
 * Întoarce true dacă mesajul a fost consumat de flux.
 */
export async function handleFlowInput(ctx: Context, chatId: number, text: string): Promise<boolean> {
  const flow = active.get(chatId);
  if (!flow) return false;

  const step = flow.def.steps[flow.stepIndex];
  const trimmed = text.trim();

  if (step.optional && trimmed === '-') {
    flow.data[step.key] = undefined;
  } else if (step.parse) {
    const result = step.parse(trimmed);
    if ('error' in result) {
      await ctx.reply(`⚠️ ${result.error}\n\n${step.prompt}`, { parse_mode: 'Markdown' });
      return true;
    }
    flow.data[step.key] = result.value;
  } else {
    flow.data[step.key] = trimmed;
  }

  flow.stepIndex += 1;

  if (flow.stepIndex < flow.def.steps.length) {
    const next = flow.def.steps[flow.stepIndex];
    await ctx.reply(next.prompt, { parse_mode: 'Markdown' });
    return true;
  }

  // Flux complet.
  active.delete(chatId);
  const confirmation = await flow.def.finish(flow.data, ctx);
  if (typeof confirmation === 'string' && confirmation.length > 0) {
    await ctx.reply(confirmation, { parse_mode: 'Markdown' });
  }
  return true;
}

// ── Parsere reutilizabile ──

export function parseNumber(input: string): { value: number } | { error: string } {
  const n = Number(input.replace(',', '.'));
  if (!Number.isFinite(n) || n < 0) return { error: 'Te rog scrie un număr valid (ex. 60).' };
  return { value: n };
}

export function parseDate(input: string): { value: string } | { error: string } {
  // Acceptă yyyy-mm-dd sau dd.mm.yyyy
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
  const ro = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  if (iso.test(input)) return { value: input };
  const m = ro.exec(input);
  if (m) return { value: `${m[3]}-${m[2]}-${m[1]}` };
  return { error: 'Format dată invalid. Folosește „2026-06-15" sau „15.06.2026".' };
}

export function parseTime(input: string): { value: string } | { error: string } {
  if (/^\d{1,2}:\d{2}$/.test(input)) {
    const [h, m] = input.split(':').map(Number);
    if (h < 24 && m < 60) return { value: input.padStart(5, '0') };
  }
  return { error: 'Format oră invalid. Folosește „14:30".' };
}
