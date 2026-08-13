# 💈 Select Barber

Aplicație mobilă de programări la frizerie, construită cu **React Native + Expo** (Expo Router, TypeScript). Are **rol dublu**: clienți care rezervă programări și frizeri care le gestionează.

## ✨ Funcționalități

### Pentru clienți
- 🔐 Autentificare și înregistrare (alegi rolul la creare cont)
- 💈 Listă de frizeri cu profil, specializare, rating și recenzii
- ✂️ Servicii cu preț și durată (tunsoare, barbă, ras cu brici, copii, styling)
- 📅 Flux de rezervare în 3 pași: serviciu → zi → oră, cu sloturi ocupate marcate
- 🗂️ Lista programărilor proprii + posibilitatea de a le anula

### Pentru frizeri
- 📋 Dashboard cu programările primite, filtrate pe Active / Finalizate / Anulate
- ✅ Marcare programare ca finalizată sau anulată
- 📊 Statistici: programări active, finalizate și încasări totale

## 🛠️ Tehnologii
- **Expo SDK 51** + **Expo Router** (navigare bazată pe fișiere)
- **TypeScript** (strict)
- **AsyncStorage** pentru persistența locală a conturilor și programărilor
- **Context API** pentru autentificare și gestionarea programărilor

> ℹ️ Datele sunt stocate **local pe dispozitiv** (mock + AsyncStorage), fără backend. Astfel aplicația rulează imediat, fără configurare de server. Logica e izolată în `src/context`, ușor de înlocuit ulterior cu un API real.

## 🚀 Rulare

```bash
npm install
npx expo start
```

Apoi:
- Scanează codul QR cu aplicația **Expo Go** (Android/iOS), sau
- Apasă `a` pentru emulator Android / `i` pentru simulator iOS.

## 🔑 Conturi demo

| Rol    | Email             | Parolă |
|--------|-------------------|--------|
| Client | `client@demo.com` | `1234` |
| Frizer | `frizer@demo.com` | `1234` |

Sau creează un cont nou și alege rolul dorit la înregistrare.

## 📁 Structura proiectului

```
app/                     # Rute (Expo Router)
  _layout.tsx            # Provideri + gardian de autentificare/rol
  index.tsx              # Redirect în funcție de sesiune
  (auth)/                # Login + înregistrare
  (client)/              # Tab-uri client: Acasă, Programări, Profil
  (barber)/              # Tab-uri frizer: Programări, Profil
  barber/[id].tsx        # Profil frizer (partajat)
  booking.tsx            # Flux de rezervare (partajat)
src/
  components/            # Button, StatusBadge, ProfileView
  context/               # AuthContext, BookingContext
  data/mockData.ts       # Frizeri, servicii, conturi demo
  theme/colors.ts        # Paletă (dark + auriu)
  utils/dates.ts         # Generare zile și sloturi orare
  storage.ts             # Wrapper AsyncStorage
  types.ts               # Tipuri TypeScript
```

---

## 🏗️ Site SELECT CONSTRUCT

Acest repository mai conține un proiect separat, în folderul [`site/`](site/): site-ul de
prezentare al firmei de construcții **SELECT CONSTRUCT** din Chișinău (reparații și
renovări interioare).

Este un site static — HTML, CSS și JavaScript, fără framework și fără pas de build. Detalii
despre structură, personalizare și publicare în [`site/README.md`](site/README.md).

```bash
cd site && python3 -m http.server 8000
```
