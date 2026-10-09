// Contact sheet of stills for review: node sheet.mjs out.png a.png b.png ...
import sharp from 'sharp';
const [out, ...files] = process.argv.slice(2);
const h = 640; const tiles = [];
let x = 0;
for (const f of files) { const b = await sharp(f).resize({ height: h }).png().toBuffer(); const m = await sharp(b).metadata(); tiles.push({ input: b, left: x, top: 0 }); x += m.width + 8; }
await sharp({ create: { width: x, height: h, channels: 3, background: '#777' } }).composite(tiles).png().toFile(out);
