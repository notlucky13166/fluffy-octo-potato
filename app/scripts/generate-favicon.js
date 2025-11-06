const fs = require('node:fs');
const path = require('node:path');

const base64Png =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAucB9YaxZBcAAAAASUVORK5CYII=';

const outputDir = path.join(__dirname, '..', 'assets');
const outputPath = path.join(outputDir, 'favicon.png');

fs.mkdirSync(outputDir, { recursive: true });
const pngBuffer = Buffer.from(base64Png, 'base64');

const shouldWrite = (() => {
  if (!fs.existsSync(outputPath)) {
    return true;
  }

  try {
    const existing = fs.readFileSync(outputPath);
    return existing.length !== pngBuffer.length || !existing.equals(pngBuffer);
  } catch (error) {
    return true;
  }
})();

if (shouldWrite) {
  fs.writeFileSync(outputPath, pngBuffer);
  console.log('Generated Expo web favicon at', outputPath);
} else {
  console.log('Expo web favicon already up to date at', outputPath);
}
