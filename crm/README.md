# 💈 SELECT ACADEMY — CRM

CRM pentru academia de barbering **Select Academy**: gestionează cursanții, încasările și cheltuielile, iar la final de lună / an vezi automat **veniturile, cheltuielile și profitul**.

> Brand: **SELECT** (negru) · **ACADEMY** (roșu). Design dark + roșu, ca logoul.

## 🚀 Cum îl deschizi

Nu necesită instalare, cont sau internet. E un **singur fișier**.

- **Pe calculator (desktop):** dublu-click pe `index.html` → se deschide în browser (Chrome, Edge, Firefox, Safari).
- **Pe telefon (mobil):** trimite-ți fișierul `index.html` pe telefon (email / WhatsApp / Drive) și deschide-l cu browserul. Interfața se adaptează automat (meniu jos cu tab-uri).
- **Bonus:** în browser → meniu → „Adaugă pe ecranul principal” și se comportă ca o aplicație.

## ✨ Ce poți face

| Secțiune | Funcții |
|----------|---------|
| **📊 Tablou de bord** | Venituri, cheltuieli, profit și nr. cursanți pe perioada aleasă (lună / an / interval / tot). Grafic lunar, încasări pe tip de curs, plăți restante, activitate recentă. |
| **🎓 Cursanți** | Adaugi fiecare cursant ca client: curs, preț, status (în curs / finalizat / abandonat), avans, instructor, notițe. Vezi progresul plății și restul de încasat. |
| **💰 Încasări** | Înregistrezi plăți (inclusiv în rate). Veniturile se calculează automat. |
| **🧾 Cheltuieli** | Chirie, materiale, salarii, marketing, utilități, echipamente, taxe etc. |
| **📈 Rapoarte** | Analiză venituri / cheltuieli / **profit** pe perioada selectată, defalcare lunară pe tot anul, venituri pe curs și cheltuieli pe categorie. Export **CSV** + **printare / PDF**. |
| **✂️ Cursuri** | Tipurile de cursuri și prețurile standard (Barber de la zero, Individual, Grup, Masterclass, Perfecționare) — editabile. |
| **⚙️ Setări & backup** | Export / import backup `.json`, date demo, resetare. |

## 🔢 Cum se calculează

- **Venituri** = suma tuturor încasărilor din perioada selectată.
- **Cheltuieli** = suma tuturor cheltuielilor din perioada selectată.
- **Profit** = Venituri − Cheltuieli (cu marja de profit %).
- **Cursanți** = câți s-au înscris în perioada aleasă + câți sunt activi în total.
- **Plăți restante** = preț curs − cât a achitat fiecare cursant.

## 💾 Unde sunt datele

Datele se salvează **local, în browserul de pe dispozitivul tău** (localStorage). Nu pleacă nicăieri, nu există server.

⚠️ **Fă backup periodic** din *Setări → Descarcă backup* și păstrează fișierul `.json` în siguranță (Drive / email). Dacă golești datele browserului sau schimbi dispozitivul, refaci totul dintr-un backup (*Setări → Importă backup*).

## 💡 Idei de extindere

Prezență la cursuri, contracte/facturi PDF, remindere automate la plățile restante, mai mulți utilizatori cu parolă, sincronizare în cloud. Spune-ne și le adăugăm.
