// Construiește afișul final: injectează pozele JRL (base64) în template
// și randează un preview PNG.
const fs = require('fs');
const sharp = require('sharp');

const dataUri = (p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');

const tpl = fs.readFileSync('assets/concurs-masterclass.svg.tpl', 'utf8');
const svg = tpl
  .replace('__CLIPPER__', dataUri('assets/jrl-clipper.png'))
  .replace('__TRIMMER__', dataUri('assets/jrl-trimmer.png'));

fs.writeFileSync('assets/concurs-masterclass.svg', svg);

sharp(Buffer.from(svg), { density: 96 })
  .png()
  .toFile('assets/concurs-masterclass-preview.png')
  .then((i) => console.log('OK', i.width + 'x' + i.height))
  .catch((e) => { console.error(e.message); process.exit(1); });
