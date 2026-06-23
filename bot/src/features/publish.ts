import type { Context } from 'telegraf';
import { ask } from '../ai.js';
import { aiEnabled } from '../config.js';
import { getAgent } from '../agents.js';
import { getChannel } from '../channels.js';
import { getDept } from '../departments.js';
import type { FlowDef } from '../flows.js';

/** Generează conținut cu directorul funcției și îl publică în canalul legat. */
async function publish(ctx: Context, functionId: string, topic: string): Promise<void> {
  const dept = getDept(functionId);
  const channel = getChannel(functionId);
  if (!dept) return;
  if (!channel) {
    await ctx.reply('🔗 Acest departament nu are încă un canal legat. Apasă „🔗 Conectează un canal".');
    return;
  }
  if (!aiEnabled) {
    await ctx.reply('🤖 Adaugă „ANTHROPIC_API_KEY" ca să poți genera postări.');
    return;
  }

  await ctx.reply('✍️ _Pregătesc postarea..._', { parse_mode: 'Markdown' });

  const prompt =
    `Scrie o postare pentru canalul „${dept.name}" (${dept.tagline}). ` +
    (topic ? `Tema: ${topic}. ` : 'Alege un sfat sau o actualizare utilă pentru azi. ') +
    'Format scurt, valoros și clar, gata de publicat. Fără introduceri inutile.';

  const text = await ask(ctx.chat!.id, prompt, undefined, getAgent(dept.agentId));

  try {
    await ctx.telegram.sendMessage(channel.chatId, text, { parse_mode: 'Markdown' });
    await ctx.reply(`✅ Am publicat în canalul *${channel.title}*.`, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Publicare eșuată:', err);
    await ctx.reply(
      '⚠️ Nu am putut publica. Verifică dacă botul este *administrator* în canal (cu drept de a posta).',
      { parse_mode: 'Markdown' },
    );
  }
}

/** Flux: întreabă tema (opțional), apoi publică în canalul funcției. */
export function makePublishFlow(functionId: string): FlowDef {
  return {
    steps: [
      {
        prompt:
          '📢 *Publică în canal*\n\nDespre ce să fie postarea?\n_(scrie „-" ca directorul să aleagă un conținut util de azi)_',
        key: 'topic',
        optional: true,
      },
    ],
    finish: async (data, ctx) => {
      await publish(ctx, functionId, data.topic ? String(data.topic) : '');
    },
  };
}
