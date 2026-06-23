import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { config, aiEnabled } from './config.js';
import { mainMenu, welcome, helpText } from './menu.js';
import { DEPARTMENTS, deptLabel, deptSubmenu, linkKeyboard, getDept } from './departments.js';
import { linkChannel, getChannel, getAllChannels } from './channels.js';
import { makePublishFlow } from './features/publish.js';
import {
  hasFlow,
  cancelFlow,
  startFlow,
  handleFlowInput,
} from './flows.js';
import { ask, selectAgent, hasSelectedAgent, resetHistory } from './ai.js';
import { getAgent } from './agents.js';
import { streamReply } from './reply.js';
import {
  listAppointments,
  listServices,
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
  // Lasă mereu să treacă actualizările din canale (legare/publicare).
  if (ctx.channelPost || ctx.myChatMember) return next();
  if (config.adminIds.length === 0) return next(); // acces public
  const userId = ctx.from?.id;
  if (userId && config.adminIds.includes(userId)) return next();
  await ctx.reply('🔒 Nu ai acces la acest bot.');
});

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

// ── Statistici / Finanțe ──
bot.command('statistici', (ctx) => ctx.reply(formatStats(), { parse_mode: 'Markdown' }));
bot.action('stats', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(formatStats(), { parse_mode: 'Markdown' });
});

// ── Servicii ──
bot.action('services', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(listServices(), { parse_mode: 'Markdown' });
});

// ── Marketing (AI) ──
bot.command('postare', (ctx) => generatePost(ctx, ctx.chat.id, ctx.payload ?? ''));
bot.command('idei', (ctx) => generateIdeas(ctx, ctx.chat.id, ctx.payload ?? ''));
bot.action('mkt_post', async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.chat) await startFlow(ctx, ctx.chat.id, postFlow);
});
bot.action('mkt_ideas', async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.chat) await startFlow(ctx, ctx.chat.id, ideasFlow);
});

// ── Misiune vânzări Masterclass ──
async function sendMission(ctx: any, ctxText: string) {
  if (!aiEnabled) {
    await ctx.reply('🤖 Adaugă „ANTHROPIC_API_KEY" ca să folosești agentul de vânzări.');
    return;
  }
  const prompt =
    'Dă echipei din grup MISIUNEA DE AZI ca să vândă cât mai multe bilete la Masterclass.' +
    (ctxText ? ` Context: ${ctxText}.` : '') +
    ' Include: 🎯 un obiectiv clar, ✅ 3-5 sarcini concrete pe care fiecare membru să le facă azi,' +
    ' 💬 1-2 mesaje gata de trimis (DM/story) și 🔥 o încurajare scurtă. Scrie ca să fie postat direct în grup.';
  await streamReply(ctx, (onUpdate) => ask(ctx.chat.id, prompt, onUpdate, getAgent('masterclass')));
}
bot.command('misiune', (ctx) => sendMission(ctx, ctx.payload?.trim() ?? ''));
bot.action('misiune', async (ctx) => {
  await ctx.answerCbQuery();
  await sendMission(ctx, '');
});

// ── Selectarea unui director AI (din mapa departamentului) ──
bot.action(/^dir:(.+)$/, async (ctx) => {
  const chatId = ctx.chat?.id;
  if (chatId === undefined) return ctx.answerCbQuery();
  const agent = selectAgent(chatId, ctx.match[1]);
  await ctx.answerCbQuery(`${agent.emoji} ${agent.name}`);
  const note = aiEnabled
    ? `${agent.emoji} *${agent.name}* este acum activ.\n_${agent.tagline}_\n\nScrie-mi ce ai nevoie — pot și *acționa* pe date.`
    : `${agent.emoji} *${agent.name}* selectat, dar AI-ul e inactiv (lipsește cheia Claude).`;
  await ctx.reply(note, { parse_mode: 'Markdown' });
});

// ── Canale: legare și publicare ──

// Botul a fost adăugat (sau promovat) într-un canal → propune legarea de o funcție.
bot.on('my_chat_member', async (ctx) => {
  const upd = ctx.myChatMember;
  const chat = upd.chat;
  const status = upd.new_chat_member.status;
  if (chat.type === 'channel' && (status === 'administrator' || status === 'member')) {
    try {
      await ctx.telegram.sendMessage(
        chat.id,
        '👋 Salut! Sunt botul SELECT. Leagă acest canal de o funcție, ca directorul ei să poată publica aici:',
        linkKeyboard(),
      );
    } catch {
      /* dacă nu are drept de postare încă, owner-ul poate scrie /leaga în canal */
    }
  }
});

// Variantă manuală: owner-ul scrie /leaga (sau /start) în canal.
bot.on('channel_post', async (ctx) => {
  const post: any = ctx.channelPost;
  const text: string = post?.text ?? '';
  if (/^\/(leaga|start)/i.test(text.trim())) {
    await ctx.telegram.sendMessage(ctx.chat.id, 'Leagă acest canal de o funcție:', linkKeyboard());
  }
});

// Owner-ul alege funcția pentru canalul curent.
bot.action(/^link:(.+)$/, async (ctx) => {
  const chat = ctx.chat;
  const dept = getDept(ctx.match[1]);
  if (!chat || !dept) return ctx.answerCbQuery();
  const title = 'title' in chat && chat.title ? chat.title : `canal ${chat.id}`;
  linkChannel(dept.id, chat.id, title);
  await ctx.answerCbQuery(`Legat de ${dept.name}`);
  await ctx.editMessageText(
    `✅ Acest canal e acum legat de *${dept.emoji} ${dept.name}*.\nDirectorul poate publica aici din meniul botului.`,
    { parse_mode: 'Markdown' },
  );
});

// Publică în canalul funcției (pornește fluxul care întreabă tema).
bot.action(/^pub:(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.chat) await startFlow(ctx, ctx.chat.id, makePublishFlow(ctx.match[1]));
});

// Explică cum se conectează un canal (când nu există încă unul legat).
bot.action(/^howlink:(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const dept = getDept(ctx.match[1]);
  await ctx.reply(
    [
      `🔗 *Conectează un canal la „${dept?.name ?? 'funcție'}"*`,
      '',
      '1. În Telegram, creează un *canal nou* (New Channel) pentru această funcție.',
      '2. Deschide canalul → *Administrators* → *Add Admin* → caută acest bot și adaugă-l',
      '   (lasă-i dreptul de a *posta mesaje*).',
      '3. Imediat ce e adăugat, botul îți trimite în canal butoanele de legare —',
      '   apasă pe această funcție. Gata!',
      '',
      '_Dacă nu apar butoanele, scrie „/leaga" direct în canal._',
    ].join('\n'),
    { parse_mode: 'Markdown' },
  );
});

// Listă canale legate.
bot.command('canale', async (ctx) => {
  const channels = getAllChannels();
  const lines = ['📢 *Canale legate*', ''];
  for (const d of DEPARTMENTS) {
    const ch = channels[d.id];
    lines.push(`${d.emoji} ${d.name}: ${ch ? `*${ch.title}*` : '_neconectat_'}`);
  }
  await ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
});

// ── Mapele departamentelor (meniul principal) ──
for (const dept of DEPARTMENTS) {
  bot.hears(deptLabel(dept), (ctx) => {
    const menu = deptSubmenu(dept);
    return ctx.reply(menu.text, { parse_mode: 'Markdown', ...menu.keyboard });
  });
}

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
