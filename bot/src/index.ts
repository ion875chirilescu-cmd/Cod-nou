import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { config, aiEnabled } from './config.js';
import {
  mainMenu,
  welcome,
  helpText,
  appointmentsMenu,
  clientsMenu,
  academyMenu,
  marketingMenu,
} from './menu.js';
import {
  hasFlow,
  cancelFlow,
  startFlow,
  handleFlowInput,
} from './flows.js';
import { ask, selectAgent, getSelectedAgent, hasSelectedAgent, resetHistory } from './ai.js';
import { AGENTS, getAgent } from './agents.js';
import { streamReply } from './reply.js';
import {
  listAppointments,
  setAppointmentStatus,
  addAppointmentFlow,
} from './features/appointments.js';
import { listClients, addClientFlow } from './features/clients.js';
import { listStudents, listCourses, addStudentFlow } from './features/academy.js';
import { formatStats } from './features/stats.js';
import { generatePost, generateIdeas, postFlow, ideasFlow } from './features/marketing.js';

const bot = new Telegraf(config.botToken);

// ── Control acces (opțional) ──
bot.use(async (ctx, next) => {
  if (config.adminIds.length === 0) return next(); // acces public
  const userId = ctx.from?.id;
  if (userId && config.adminIds.includes(userId)) return next();
  await ctx.reply('🔒 Nu ai acces la acest bot.');
});

// ── Tastatura agenților AI ──
function agentsKeyboard() {
  return Markup.inlineKeyboard(
    AGENTS.map((a) => [Markup.button.callback(`${a.emoji} ${a.name} — ${a.tagline}`, `agent:${a.id}`)]),
  );
}

// ── Start & ajutor ──
bot.start(async (ctx) => {
  console.log(`👤 Utilizator: ${ctx.from.first_name} (ID: ${ctx.from.id})`);
  await ctx.reply(welcome(ctx.from.first_name), { parse_mode: 'Markdown', ...mainMenu });
});

bot.help((ctx) => ctx.reply(helpText, { parse_mode: 'Markdown' }));
bot.command('ajutor', (ctx) => ctx.reply(helpText, { parse_mode: 'Markdown' }));

bot.command('anuleaza', async (ctx) => {
  const chatId = ctx.chat.id;
  if (hasFlow(chatId)) {
    cancelFlow(chatId);
    await ctx.reply('❌ Am anulat. Cu ce te ajut acum?', mainMenu);
  } else {
    await ctx.reply('Nu e nimic de anulat.');
  }
});

bot.command('reset', async (ctx) => {
  resetHistory(ctx.chat.id);
  await ctx.reply('🧹 Am șters contextul conversației AI.');
});

// ── Programări ──
async function showAppointments(ctx: any) {
  const { text, keyboard } = listAppointments();
  await ctx.reply(text, { parse_mode: 'Markdown', ...(keyboard ?? {}) });
}
bot.command('programari', showAppointments);
bot.command('adauga_programare', (ctx) => startFlow(ctx, ctx.chat.id, addAppointmentFlow));

// Mapa „Programări"
bot.hears('📅 Programări', (ctx) =>
  ctx.reply(appointmentsMenu.text, { parse_mode: 'Markdown', ...appointmentsMenu.keyboard }),
);
bot.action('apt_add', async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.chat) await startFlow(ctx, ctx.chat.id, addAppointmentFlow);
});
bot.action('apt_list', async (ctx) => {
  await ctx.answerCbQuery();
  await showAppointments(ctx);
});

bot.action(/^apt_done:(.+)$/, async (ctx) => {
  const apt = setAppointmentStatus(ctx.match[1], 'finalizata');
  await ctx.answerCbQuery(apt ? '✅ Finalizată' : 'Negăsită');
  if (apt) await ctx.editMessageText(`✅ Finalizată: *${apt.clientName}* — ${apt.price} lei`, { parse_mode: 'Markdown' });
});
bot.action(/^apt_cancel:(.+)$/, async (ctx) => {
  const apt = setAppointmentStatus(ctx.match[1], 'anulata');
  await ctx.answerCbQuery(apt ? '❌ Anulată' : 'Negăsită');
  if (apt) await ctx.editMessageText(`❌ Anulată: *${apt.clientName}* (${apt.date} ${apt.time})`, { parse_mode: 'Markdown' });
});

// ── Clienți ──
bot.command('clienti', (ctx) => ctx.reply(listClients(), { parse_mode: 'Markdown' }));
bot.command('adauga_client', (ctx) => startFlow(ctx, ctx.chat.id, addClientFlow));

// Mapa „Clienți"
bot.hears('👥 Clienți', (ctx) =>
  ctx.reply(clientsMenu.text, { parse_mode: 'Markdown', ...clientsMenu.keyboard }),
);
bot.action('cli_add', async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.chat) await startFlow(ctx, ctx.chat.id, addClientFlow);
});
bot.action('cli_list', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(listClients(), { parse_mode: 'Markdown' });
});

// ── Academy ──
bot.command('cursanti', (ctx) => ctx.reply(listStudents(), { parse_mode: 'Markdown' }));
bot.command('cursuri', (ctx) => ctx.reply(listCourses(), { parse_mode: 'Markdown' }));
bot.command('adauga_cursant', (ctx) => startFlow(ctx, ctx.chat.id, addStudentFlow));

// Mapa „Academy"
bot.hears('🎓 Academy', (ctx) =>
  ctx.reply(academyMenu.text, { parse_mode: 'Markdown', ...academyMenu.keyboard }),
);
bot.action('aca_add', async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.chat) await startFlow(ctx, ctx.chat.id, addStudentFlow);
});
bot.action('aca_students', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(listStudents(), { parse_mode: 'Markdown' });
});
bot.action('aca_courses', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(listCourses(), { parse_mode: 'Markdown' });
});

// ── Statistici ──
bot.command('statistici', (ctx) => ctx.reply(formatStats(), { parse_mode: 'Markdown' }));
bot.hears('📊 Statistici', (ctx) => ctx.reply(formatStats(), { parse_mode: 'Markdown' }));

// ── Marketing (AI) ──
bot.command('postare', (ctx) => generatePost(ctx, ctx.chat.id, ctx.payload ?? ''));
bot.command('idei', (ctx) => generateIdeas(ctx, ctx.chat.id, ctx.payload ?? ''));

// Mapa „Marketing"
bot.hears('✨ Marketing', (ctx) =>
  ctx.reply(marketingMenu.text, { parse_mode: 'Markdown', ...marketingMenu.keyboard }),
);
bot.action('mkt_post', async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.chat) await startFlow(ctx, ctx.chat.id, postFlow);
});
bot.action('mkt_ideas', async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.chat) await startFlow(ctx, ctx.chat.id, ideasFlow);
});

// ── Vânzări Masterclass (pentru grup) ──
// Generează misiunea de azi pentru echipă — gata de postat în grup.
bot.command('misiune', async (ctx) => {
  if (!aiEnabled) {
    await ctx.reply('🤖 Adaugă „ANTHROPIC_API_KEY" ca să folosești agentul de vânzări.');
    return;
  }
  const ctxText = ctx.payload?.trim();
  const prompt =
    'Dă echipei din grup MISIUNEA DE AZI ca să vândă cât mai multe bilete la Masterclass.' +
    (ctxText ? ` Context: ${ctxText}.` : '') +
    ' Include: 🎯 un obiectiv clar, ✅ 3-5 sarcini concrete pe care fiecare membru să le facă azi,' +
    ' 💬 1-2 mesaje gata de trimis (DM/story) și 🔥 o încurajare scurtă. Scrie ca să fie postat direct în grup.';
  await streamReply(ctx, (onUpdate) => ask(ctx.chat.id, prompt, onUpdate, getAgent('masterclass')));
});

// ── Agenți AI ──
bot.hears('🤖 Asistent AI', async (ctx) => {
  const current = getSelectedAgent(ctx.chat.id);
  const status = aiEnabled
    ? `Agent activ: *${current.emoji} ${current.name}*. Scrie-mi liber sau alege alt agent:`
    : '🤖 AI inactiv — adaugă „ANTHROPIC_API_KEY" în bot/.env. Comenzile și meniurile merg normal.';
  await ctx.reply(`🤖 *Echipa de agenți AI*\n\n${status}`, {
    parse_mode: 'Markdown',
    ...agentsKeyboard(),
  });
});

bot.action(/^agent:(.+)$/, async (ctx) => {
  const chatId = ctx.chat?.id;
  if (chatId === undefined) return ctx.answerCbQuery();
  const agent = selectAgent(chatId, ctx.match[1]);
  await ctx.answerCbQuery(`${agent.emoji} ${agent.name}`);
  await ctx.editMessageText(
    `${agent.emoji} *${agent.name}* este acum activ.\n_${agent.tagline}_\n\nScrie-mi ce ai nevoie.`,
    { parse_mode: 'Markdown' },
  );
});

// ── Mesaje text libere: flux activ → AI ──
bot.on(message('text'), async (ctx) => {
  const chatId = ctx.chat.id;
  const text = ctx.message.text;
  const isGroup = ctx.chat.type === 'group' || ctx.chat.type === 'supergroup';

  // Ignoră textul butoanelor de meniu (sunt tratate de bot.hears de mai sus).
  if (text.startsWith('/')) return;

  // Dacă suntem într-un flux pas-cu-pas, mesajul îi aparține.
  if (hasFlow(chatId)) {
    await handleFlowInput(ctx, chatId, text);
    return;
  }

  if (!aiEnabled) {
    if (!isGroup) {
      await ctx.reply('🤖 Asistentul AI nu e configurat. Folosește meniul sau /ajutor pentru comenzi.');
    }
    return;
  }

  let prompt = text;

  if (isGroup) {
    // În grup răspunde DOAR când e chemat: menționat (@bot) sau i se răspunde (reply).
    const username = ctx.botInfo?.username;
    const mentioned = username ? text.includes(`@${username}`) : false;
    const repliedToBot = ctx.message.reply_to_message?.from?.id === ctx.botInfo?.id;
    if (!mentioned && !repliedToBot) return; // conversație între membri — ignoră

    // Implicit, în grup agentul este antrenorul de vânzări Masterclass.
    if (!hasSelectedAgent(chatId)) selectAgent(chatId, 'masterclass');

    // Curăță mențiunea din text.
    if (username) prompt = text.split(`@${username}`).join('').trim();
    if (!prompt) prompt = 'Dă echipei instrucțiuni concrete ca să vândă cât mai multe bilete la Masterclass azi.';
  }

  await streamReply(ctx, (onUpdate) => ask(chatId, prompt, onUpdate));
});

// ── Pornire ──
bot.catch((err, ctx) => {
  console.error(`Eroare la procesarea update-ului ${ctx.updateType}:`, err);
});

function onStart() {
  console.log('🤖 SELECT BOT pornit.');
  console.log(`   AI: ${aiEnabled ? 'activ (Claude Opus 4.8)' : 'inactiv'}`);
  console.log(`   Acces: ${config.adminIds.length ? `restricționat (${config.adminIds.length} admin)` : 'public'}`);
}

/**
 * Pornește botul, reîncercând la eroarea 409 (Conflict) — apare temporar la
 * repornire, când copia veche încă rulează. Reîncearcă până se eliberează.
 */
async function launchWithRetry(attempt = 1): Promise<void> {
  try {
    await bot.launch({ dropPendingUpdates: true }, onStart);
  } catch (err: any) {
    const code = err?.response?.error_code ?? err?.code;
    if (code === 409 && attempt <= 12) {
      const wait = Math.min(attempt * 3, 15);
      console.warn(`⚠️ 409 Conflict — altă copie încă rulează. Reîncerc în ${wait}s... (${attempt}/12)`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      return launchWithRetry(attempt + 1);
    }
    console.error('Pornirea a eșuat:', err);
    process.exit(1);
  }
}

launchWithRetry();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
