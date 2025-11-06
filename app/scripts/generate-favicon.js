const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const outputDir = path.join(__dirname, '..', 'assets');
const outputPath = path.join(outputDir, 'favicon.png');

const width = 64;
const height = 64;

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const chunk = Buffer.alloc(12 + data.length);

  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);

  const crcValue = crc32(chunk.subarray(4, 8 + data.length));
  chunk.writeUInt32BE(crcValue >>> 0, 8 + data.length);

  return chunk;
}

function createFaviconBuffer() {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const bytesPerRow = width * 4 + 1;
  const raw = Buffer.alloc(bytesPerRow * height);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * bytesPerRow;
    raw[rowStart] = 0; // no filter
    for (let x = 0; x < width; x += 1) {
      const pixelOffset = rowStart + 1 + x * 4;
      const gradient = Math.floor((x / (width - 1)) * 255);
      raw[pixelOffset] = gradient; // red channel
      raw[pixelOffset + 1] = Math.floor((y / (height - 1)) * 255); // green channel
      raw[pixelOffset + 2] = 200; // blue channel
      raw[pixelOffset + 3] = 255; // alpha
    }
  }

  const compressed = zlib.deflateSync(raw);

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

fs.mkdirSync(outputDir, { recursive: true });
const pngBuffer = createFaviconBuffer();

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
