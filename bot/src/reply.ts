import type { Context } from 'telegraf';

const TG_LIMIT = 4000; // limită Telegram ~4096; lăsăm marjă

/** Trimite text lung în mai multe mesaje dacă depășește limita Telegram. */
async function sendChunks(ctx: Context, text: string): Promise<void> {
  for (let i = 0; i < text.length; i += TG_LIMIT) {
    const chunk = text.slice(i, i + TG_LIMIT);
    // Încearcă cu Markdown; dacă formatul e invalid, trimite ca text simplu.
    try {
      await ctx.reply(chunk, { parse_mode: 'Markdown' });
    } catch {
      await ctx.reply(chunk);
    }
  }
}

/**
 * Rulează un producător de text AI cu streaming și afișează progresul în Telegram:
 * trimite un mesaj „se gândește", îl actualizează pe parcurs, apoi pune textul final.
 */
export async function streamReply(
  ctx: Context,
  run: (onUpdate: (partial: string) => void) => Promise<string>,
): Promise<void> {
  await ctx.sendChatAction('typing');
  const placeholder = await ctx.reply('🤖 _Mă gândesc..._', { parse_mode: 'Markdown' });
  const chatId = placeholder.chat.id;
  const messageId = placeholder.message_id;

  let lastShown = '';
  const onUpdate = (partial: string) => {
    const preview = partial.length > TG_LIMIT ? partial.slice(0, TG_LIMIT) + '…' : partial;
    if (preview === lastShown || preview.length === 0) return;
    lastShown = preview;
    // Actualizările intermediare sunt „best effort" — ignorăm erorile (rate limit, format).
    ctx.telegram.editMessageText(chatId, messageId, undefined, preview).catch(() => {});
  };

  let final: string;
  try {
    final = await run(onUpdate);
  } catch (err) {
    console.error('Eroare AI:', err);
    await ctx.telegram
      .editMessageText(chatId, messageId, undefined, '⚠️ A apărut o eroare la generare. Încearcă din nou.')
      .catch(() => {});
    return;
  }

  // Înlocuiește placeholder-ul cu prima bucată formatată, restul ca mesaje noi.
  const head = final.length > TG_LIMIT ? final.slice(0, TG_LIMIT) : final;
  try {
    await ctx.telegram.editMessageText(chatId, messageId, undefined, head, { parse_mode: 'Markdown' });
  } catch {
    await ctx.telegram.editMessageText(chatId, messageId, undefined, head).catch(() => {});
  }
  if (final.length > TG_LIMIT) {
    await sendChunks(ctx, final.slice(TG_LIMIT));
  }
}
