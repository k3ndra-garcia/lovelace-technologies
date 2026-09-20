// Generates brand assets from the source silhouette in "Media for Lovelace":
//   - transparent marks for light and dark backgrounds
//   - the app icon
//   - the punch-card grid used by the hero (which cells form the profile)
// Run with: npm run brand
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "Media for Lovelace", "LovelaceIconFinal.png");

const GRAPHITE = { r: 0x16, g: 0x19, b: 0x1d };
const PORCELAIN = { r: 0xee, g: 0xf0, b: 0xef };

// Luminance → alpha: the black silhouette becomes opaque, white paper transparent.
async function loadCoverage() {
  const { data, info } = await sharp(source)
    .flatten({ background: "#ffffff" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function tintedMark({ data, width, height }, color, size) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = color.r;
    rgba[i * 4 + 1] = color.g;
    rgba[i * 4 + 2] = color.b;
    rgba[i * 4 + 3] = 255 - data[i];
  }
  return sharp(rgba, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ height: size, fit: "inside" })
    .png()
    .toBuffer();
}

// Each cell holds how much of the silhouette covers it, as one hex digit
// (0 = empty, f = solid). The card scales each hole by that coverage, so
// edges taper instead of stair-stepping.
function sampleGrid({ data, width, height }, cols, rows) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      const x0 = Math.floor((c / cols) * width);
      const x1 = Math.max(x0 + 1, Math.floor(((c + 1) / cols) * width));
      const y0 = Math.floor((r / rows) * height);
      const y1 = Math.max(y0 + 1, Math.floor(((r + 1) / rows) * height));
      let ink = 0;
      let n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          ink += 255 - data[y * width + x];
          n++;
        }
      }
      line += Math.round((ink / (n * 255)) * 15).toString(16);
    }
    cells.push(line);
  }
  return cells;
}

const coverage = await loadCoverage();
await mkdir(path.join(root, "public", "brand"), { recursive: true });

await writeFile(
  path.join(root, "public", "brand", "lovelace-mark.png"),
  await tintedMark(coverage, GRAPHITE, 256),
);
await writeFile(
  path.join(root, "public", "brand", "lovelace-mark-light.png"),
  await tintedMark(coverage, PORCELAIN, 256),
);

// App icon: porcelain mark centred on the dark ground.
const iconMark = await tintedMark(coverage, PORCELAIN, 400);
await writeFile(
  path.join(root, "src", "app", "icon.png"),
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: "#0F1113" },
  })
    .composite([{ input: iconMark, gravity: "center" }])
    .png()
    .toBuffer(),
);

// Grid resolution: higher means smaller holes and more of the profile.
const GRID = Number(process.argv[2]) || 100;
const grid = { cols: GRID, rows: GRID, cells: sampleGrid(coverage, GRID, GRID) };
await writeFile(
  path.join(root, "src", "content", "silhouette-grid.json"),
  JSON.stringify(grid, null, 2) + "\n",
);

const ramp = "·······--=+*#%●●";
console.log(
  grid.cells
    .map((row) => [...row].map((ch) => ramp[parseInt(ch, 16)]).join(""))
    .join("\n"),
);
