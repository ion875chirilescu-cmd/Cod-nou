// Elimină fundalul alb din pozele de produs (flood-fill de la margini)
// și decupează la conținut. Output: PNG cu transparență.
const sharp = require('sharp');

async function removeBg(input, output) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info; // channels = 4
  const idx = (x, y) => (y * width + x) * channels;

  // Un pixel e "fundal" dacă e aproape alb
  const isWhite = (i) => data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 232;

  const visited = new Uint8Array(width * height);
  const stack = [];
  // pornește din toate marginile
  for (let x = 0; x < width; x++) { stack.push([x, 0]); stack.push([x, height - 1]); }
  for (let y = 0; y < height; y++) { stack.push([0, y]); stack.push([width - 1, y]); }

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const p = y * width + x;
    if (visited[p]) continue;
    const i = idx(x, y);
    if (!isWhite(i)) continue;
    visited[p] = 1;
    data[i + 3] = 0; // transparent
    stack.push([x + 1, y]); stack.push([x - 1, y]);
    stack.push([x, y + 1]); stack.push([x, y - 1]);
  }

  const tmp = await sharp(data, { raw: { width, height, channels } })
    .png().toBuffer();

  // decupează la conținut (zona transparentă din jur)
  const out = await sharp(tmp).trim({ threshold: 1 }).toFile(output);
  console.log(output, '->', out.width + 'x' + out.height);
}

(async () => {
  await removeBg(process.argv[2], process.argv[3]);
})();
