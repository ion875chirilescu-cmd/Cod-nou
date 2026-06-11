import type { Context } from 'telegraf';
import { ask } from '../ai.js';
import { aiEnabled } from '../config.js';
import { getAgent } from '../agents.js';
import { streamReply } from '../reply.js';
import type { FlowDef } from '../flows.js';

/** /postare [temă] — generează o postare social media gata de publicat. */
export async function generatePost(ctx: Context, chatId: number, topic: string): Promise<void> {
  if (!aiEnabled) {
    await ctx.reply('🤖 Adaugă „ANTHROPIC_API_KEY" în bot/.env ca să folosești marketingul AI.');
    return;
  }
  const subject = topic.trim() || 'o promoție la serviciile de frizerie din această săptămână';
  const prompt = [
    `Creează o postare pentru Instagram/Facebook despre: ${subject}.`,
    'Dă-mi: un text scurt și captivant, 2-3 emoji potrivite, un call-to-action clar',
    'și 5-8 hashtag-uri relevante (frizerie, barbershop, local). Gata de copiat.',
  ].join(' ');
  await streamReply(ctx, (onUpdate) => ask(chatId, prompt, onUpdate, getAgent('content')));
}

/** /idei [context] — idei de campanii și promoții. */
export async function generateIdeas(ctx: Context, chatId: number, context: string): Promise<void> {
  if (!aiEnabled) {
    await ctx.reply('🤖 Adaugă „ANTHROPIC_API_KEY" în bot/.env ca să folosești marketingul AI.');
    return;
  }
  const extra = context.trim() ? ` Ține cont de: ${context.trim()}.` : '';
  const prompt =
    `Dă-mi 5 idei concrete de campanii sau promoții pentru luna aceasta, pentru frizerie ` +
    `și pentru academia de frizerie.${extra} Pentru fiecare idee: titlu, pe scurt cum funcționează ` +
    `și de ce ar aduce clienți/cursanți.`;
  await streamReply(ctx, (onUpdate) => ask(chatId, prompt, onUpdate, getAgent('director_marketing')));
}

// ── Fluxuri pentru butoanele din mapa „Marketing" ──

/** Întreabă tema, apoi generează o postare. */
export const postFlow: FlowDef = {
  steps: [
    {
      prompt:
        '📣 *Postare nouă*\n\nDespre ce să fie postarea?\n_(ex. promoție tuns + barbă, cursul de începători, program de weekend)_\n\nScrie „-" pentru o postare generală.',
      key: 'topic',
      optional: true,
    },
  ],
  finish: async (data, ctx) => {
    await generatePost(ctx, ctx.chat!.id, data.topic ? String(data.topic) : '');
  },
};

/** Întreabă contextul, apoi dă idei de campanii. */
export const ideasFlow: FlowDef = {
  steps: [
    {
      prompt:
        '💡 *Idei de campanii*\n\nAi un context anume? _(ex. e vară, vreau clienți noi, promovez Academy)_\n\nScrie „-" pentru idei generale.',
      key: 'context',
      optional: true,
    },
  ],
  finish: async (data, ctx) => {
    await generateIdeas(ctx, ctx.chat!.id, data.context ? String(data.context) : '');
  },
};
