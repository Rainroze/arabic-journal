import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateIcons() {
  const sizes = [192, 512];
  const inputSvg = join(__dirname, 'public', 'app-icon.svg');
  const svgBuffer = fs.readFileSync(inputSvg);

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(__dirname, 'public', `icon-${size}.png`));
    console.log(`Generated ${size}x${size} icon`);
  }

  // Create apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(__dirname, 'public', 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon');
}

generateIcons().catch(console.error);
