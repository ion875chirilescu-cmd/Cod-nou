# 🤖 SELECT BOT — echipa digitală pe Telegram

Bot de Telegram cu **agenți AI** (Claude) pentru a conduce și dezvolta
**SELECT BARBER** și **SELECT ACADEMY**: programări, clienți, cursanți,
statistici și marketing — toate dintr-o conversație.

## ✨ Ce poate face

### 🤖 Agenți AI (Claude Opus 4.8)
O echipă de asistenți specializați — alegi unul și scrii liber:
- 🧠 **Manager** — strategie, decizii, organizare, interpretarea cifrelor
- 📣 **Marketing** — campanii, promoții, social media
- 💰 **Vânzări & Clienți** — fidelizare, upsell, mesaje către clienți
- 🎓 **Academy** — cursuri, recrutare cursanți, training
- ✍️ **Content Creator** — postări, scenarii Reels/TikTok, descrieri

Agenții cunosc cifrele reale ale afacerii (li se injectează un rezumat live),
deci pot răspunde și pe date concrete, nu doar generalități.

### 📋 Operațiuni
- **Programări** — listă, adăugare pas-cu-pas, marcare ca finalizată/anulată
- **Clienți** — bază de clienți cu vizite, total cheltuit, notițe
- **Academy** — cursanți, taxe, restanțe, cursuri
- **Statistici** — încasări, programări, restanțe academie
- **Marketing** — `/postare` și `/idei` generate de AI

## 🚀 Pornire

```bash
cd bot
npm install
cp .env.example .env      # completează token-ul (și opțional cheia AI)
npm start
```

### 1. Token de la BotFather (obligatoriu)
Pe Telegram, scrie-i lui [@BotFather](https://t.me/BotFather):
1. `/newbot` → alege un nume și un username
2. Copiază token-ul primit în `.env` la `TELEGRAM_BOT_TOKEN`

### 2. Cheia Claude pentru AI (opțional, dar recomandat)
Botul merge și fără ea (comenzi + meniuri), dar agenții AI au nevoie de o cheie.
Ia una de la [console.anthropic.com](https://console.anthropic.com) și pune-o
în `.env` la `ANTHROPIC_API_KEY`.

### 3. Restricționare acces (opțional)
Ca să folosească botul doar tu și echipa ta, pune ID-urile de Telegram în
`ADMIN_IDS` (separate prin virgulă). Îți afli ID-ul scriind `/start` botului
(apare în consolă) sau cu [@userinfobot](https://t.me/userinfobot).

## 🗂️ Date

Datele se salvează local în `bot/data/db.json` (fără server, ca aplicația
mobilă). Serviciile și frizerii sunt preîncărcați identic cu aplicația
Select Barber. Logica de stocare e izolată în `src/db.ts`, ușor de înlocuit
ulterior cu un backend real.

## 📁 Structură

```
bot/
  src/
    index.ts            # punctul de intrare, rutele botului
    config.ts           # citește .env
    agents.ts           # definițiile agenților AI specializați
    ai.ts               # integrarea cu Claude (streaming, context, agenți)
    reply.ts            # afișarea răspunsurilor AI în streaming în Telegram
    flows.ts            # fluxuri pas-cu-pas pentru introducerea datelor
    menu.ts             # tastaturi și texte
    db.ts               # stocare locală JSON + date inițiale
    types.ts            # tipuri TypeScript
    features/
      appointments.ts   # programări
      clients.ts        # clienți
      academy.ts        # cursanți + cursuri
      stats.ts          # statistici + rezumat pentru AI
      marketing.ts      # postări & idei (AI)
  data/db.json          # date locale (generat la prima rulare)
```

## 🛠️ Tehnologii
- [Telegraf](https://telegraf.js.org/) — framework pentru boturi Telegram
- [@anthropic-ai/sdk](https://github.com/anthropics/anthropic-sdk-typescript) — Claude
- TypeScript + tsx
