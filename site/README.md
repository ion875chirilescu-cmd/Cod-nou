# 🏗️ SELECT CONSTRUCT — site de prezentare

Site static (HTML + CSS + JavaScript, fără framework și fără build) pentru o firmă de
construcții din **Chișinău, Republica Moldova**, specializată în **reparații și
renovări interioare**.

## 📂 Structură

```
site/
  index.html                # întreaga pagină (o singură pagină, cu ancore)
  assets/
    css/styles.css          # stiluri, tokeni de culoare, temă luminoasă/întunecată
    js/main.js              # meniu, filtre, calculator, formular, animații
    img/
      favicon.svg           # iconița din tab
      logo.svg              # logo pentru social media / documente
```

## 🚀 Rulare locală

Fiind un site static, poți deschide direct `index.html` în browser. Pentru un
comportament identic cu cel de pe server, pornește un server local:

```bash
cd site
python3 -m http.server 8000
# apoi deschide http://localhost:8000
```

## 🧩 Ce conține pagina

| Secțiune | Ancoră | Ce face |
|---|---|---|
| Hero | `#top` | Mesaj principal, două CTA-uri și cifrele firmei (animate) |
| Servicii | `#servicii` | 9 servicii de interior, fiecare cu lista lucrărilor incluse |
| Cum lucrăm | `#proces` | Procesul în 4 pași, de la vizită la garanție |
| De ce noi | `#despre` | Diferențiatori + testimonial evidențiat |
| Lucrări | `#lucrari` | Galerie filtrabilă pe categorii + comparație „înainte / după" |
| Estimare preț | `#calculator` | Calculator interactiv de manoperă (tip lucrare × mp × finisaj) |
| Recenzii | `#recenzii` | Trei recenzii de clienți |
| Întrebări | `#intrebari` | 7 întrebări frecvente (accordion nativ `<details>`) |
| Contact | `#contact` | Formular validat + date de contact |

Alte lucruri incluse: temă luminoasă/întunecată cu memorare, meniu mobil,
buton flotant de apel pe telefon, marcaje `schema.org` pentru Google,
etichete Open Graph, suport pentru `prefers-reduced-motion` și stiluri de print.

## ✏️ Ce trebuie personalizat înainte de publicare

Toate datele de mai jos sunt **exemple** și trebuie înlocuite cu cele reale:

1. **Telefon** — `+37376986728` / `076 986 728` în `index.html`
   (apare în header, în banda CTA, în contact, în footer, în butonul flotant,
   în linkurile de Viber și WhatsApp și în `schema.org`).
2. **E-mail** — caută `contact@selectconstruct.md` în `index.html` și în
   `CONFIG.email` din `assets/js/main.js`.
3. **Adresă, program, IDNO** — în secțiunea de contact, în footer și în blocul
   `application/ld+json` din `<head>`.
4. **Domeniu** — `https://www.selectconstruct.md/` din `<link rel="canonical">`
   și din marcajele Open Graph.
5. **Cifre și lucrări** — din statisticile hero (`data-count`), „4 oameni în echipă"
   și „5 ani de experiență" sunt reale. „75 lucrări finalizate" și „98% clienți
   mulțumiți" sunt estimări puse ca să fie credibile pentru patru oameni în cinci ani —
   înlocuiește-le cu cifrele tale. Lucrările din portofoliu și recenziile sunt tot exemple.

### Fotografii reale în portofoliu

Miniaturile din galerie sunt modele grafice desenate în CSS
(clasele `.pattern-tiles`, `.pattern-parquet`, `.pattern-paint` etc.), ca site-ul
să arate bine și fără poze. Când ai fotografii, înlocuiește în `index.html`:

```html
<div class="work-img pattern-parquet"><span class="work-tag">Renovare completă</span></div>
```

cu:

```html
<div class="work-img">
  <img src="assets/img/lucrari/botanica-living.jpg" alt="Living renovat în Botanica" loading="lazy" />
  <span class="work-tag">Renovare completă</span>
</div>
```

și adaugă în CSS: `.work-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }`.

### Formularul de contact

Implicit, formularul validează datele și deschide clientul de e-mail al
vizitatorului cu mesajul deja completat — funcționează pe orice hosting static,
fără backend.

Ca să primești solicitările direct pe e-mail sau într-un panou, completează
`CONFIG.formEndpoint` din `assets/js/main.js` cu un endpoint care acceptă POST
(Formspree, Getform, Netlify Forms, Web3Forms sau propriul tău server).
Formularul trimite un JSON cu cheile: `nume`, `telefon`, `email`, `lucrare`,
`suprafata`, `mesaj`, `gdpr`.

Validarea numărului de telefon acceptă formatele din Republica Moldova — mobil
(`069 123 456`, `+373 69 123 456`) și fix Chișinău (`022 123 456`). Regexul este
`phoneRe` din `initContactForm()`.

### Prețurile din calculator

Tarifele sunt în obiectul `RATES` din `assets/js/main.js`, exprimate în **lei
moldovenești (MDL) pe metru pătrat**, doar pentru **manoperă**. Sunt calibrate pe
piața din Chișinău și trebuie ajustate la prețurile tale reale:

```js
renovare: { min: 1200, max: 2200, days: 0.55, mat: 0.55, basis: 'utila', label: 'Renovare completă' },
```

- `min` / `max` — intervalul de preț pe metru pătrat
- `days` — zile lucrătoare per metru pătrat (pentru durata estimată)
- `mat` — factor pentru estimarea materialelor de bază (raportat la manoperă)
- `basis` — la ce se raportează suprafața: `utila` (mp de pardoseală) sau
  `montaj` (mp acoperiți efectiv). Schimbă textul explicativ de sub cursor.

Nivelurile de finisaj (Standard / Premium / Lux) sunt multiplicatori setați în
`index.html`, pe `input[name="calcLevel"]` (1 / 1,22 / 1,5).

## 🎨 Culori

Paleta se schimbă dintr-un singur loc — variabilele din `:root`, în
`assets/css/styles.css`. Accentul este `--accent: #D98324` (chihlimbar), iar
tema întunecată își redefinește tokenii în `:root[data-theme="dark"]`.

## 🌐 Publicare

Fiind un site pur static, merge oriunde: GitHub Pages, Netlify, Vercel,
Cloudflare Pages sau un hosting clasic prin FTP. Urcă tot conținutul folderului
`site/` în rădăcina domeniului.
