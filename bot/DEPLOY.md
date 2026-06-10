# 🚀 Cum pornești botul de pe telefon (găzduire 24/7)

Ghid pas-cu-pas pentru a rula SELECT BOT non-stop, fără calculator, folosind
**Railway** — un serviciu care pornește botul direct din codul tău de pe GitHub.

> 💡 Botul nu trebuie să stea pornit pe telefonul tău. Odată pus pe Railway,
> rulează singur în cloud, zi și noapte.

---

## Ce-ți trebuie
- Contul tău de GitHub (unde e codul)
- Token-ul de Telegram (de la @BotFather)
- Cheia Claude (de la console.anthropic.com) + **credite adăugate** (min. ~5 USD)

---

## Pașii (din browserul telefonului)

### 1. Creează cont Railway
- Intră pe **railway.com** → **Login** → **Login with GitHub**
- Autorizează accesul

### 2. Proiect nou din GitHub
- Apasă **New Project** → **Deploy from GitHub repo**
- Alege repository-ul **Cod-nou**
- Dacă-ți cere, apasă **Configure GitHub App** și dă-i acces la repo

### 3. Setează de unde citește codul
Intră în serviciul creat → **Settings** → secțiunea **Source**:
- **Branch**: alege `claude/telegram-bot-barber-business-wctt4t`
- **Root Directory**: scrie `bot`

(Astfel Railway folosește exact folderul botului și `Dockerfile`-ul lui.)

### 4. Adaugă token-ul și cheia (secrete)
Tot în serviciu → tab-ul **Variables** → **New Variable**, adaugă două:

| Nume | Valoare |
|------|---------|
| `TELEGRAM_BOT_TOKEN` | token-ul de la @BotFather |
| `ANTHROPIC_API_KEY` | cheia de la console.anthropic.com |

> 🔒 Aici e locul sigur pentru secrete — NU în cod. Le poți schimba oricând.

### 5. Pornește
- Railway pornește automat (sau apasă **Deploy**)
- Deschide tab-ul **Deploy Logs**. Când vezi:
  ```
  🤖 SELECT BOT pornit.
     AI: activ (Claude Opus 4.8)
  ```
  …botul e live! Scrie-i `/start` pe Telegram.

---

## Note utile

- **Costuri**: Railway oferă credit gratuit de test, apoi ~5 USD/lună pentru
  un bot mic. Separat, agenții AI consumă din creditele tale Claude (fracțiuni
  de cent per conversație).

- **Păstrarea datelor**: implicit, datele (programări, clienți) se țin în
  `data/db.json` în container și se pierd la fiecare redeploy. Ca să rămână
  permanent, în Railway: **Settings → Volumes → New Volume**, montat la
  calea `/app/data`. (Opțional, dar recomandat când începi să-l folosești real.)

- **Schimbi token-ul/cheia?** Doar actualizezi variabila în tab-ul Variables și
  Railway repornește botul automat.

---

## Alternative
- **Render.com** — similar, dar botul trebuie creat ca **Background Worker**
  (nu „Web Service"), Root Directory `bot`, plan plătit pentru worker non-stop.
- **VPS propriu** — vezi secțiunea pm2/Docker din `README.md`.
