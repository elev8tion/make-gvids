/**
 * Mock generation helpers.
 *
 * When the relevant provider key is missing (or MOCK_GENERATION=1) the seams in
 * provider.js fall back to these deterministic placeholders instead of throwing,
 * so the full app flow completes end-to-end without any API keys.
 *
 * Each placeholder is a real, viewable file persisted under /generated and is
 * generated lazily + cached (deterministic filename per kind).
 */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';

export const MOCK_GENERATION = process.env.MOCK_GENERATION === '1';

const PORT = process.env.PORT || 8787;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const GENERATED_DIR = path.join(process.cwd(), 'generated');
const FFMPEG = process.env.FFMPEG_PATH || '/opt/homebrew/bin/ffmpeg';

// kind → { file, type }
const PLACEHOLDERS = {
  isolate: { file: 'mock-isolate.png', type: 'image' },
  tryon: { file: 'mock-tryon.png', type: 'image' },
  compose: { file: 'mock-compose.png', type: 'image' },
  animate: { file: 'mock-animate.mp4', type: 'video' },
};

const COLORS = {
  isolate: '#1f6feb',
  tryon: '#8957e5',
  compose: '#2da44e',
  animate: '#cf222e',
};

function generatedUrl(file) {
  return `${BACKEND_URL}/generated/${file}`;
}

function ensureDir() {
  if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

async function ensureImagePlaceholder(kind, filePath) {
  if (fs.existsSync(filePath)) return;
  const color = COLORS[kind] || '#57606a';
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280">
       <rect width="100%" height="100%" fill="${color}"/>
       <text x="50%" y="48%" font-family="sans-serif" font-size="56" fill="#ffffff"
             text-anchor="middle">MOCK</text>
       <text x="50%" y="56%" font-family="sans-serif" font-size="40" fill="#ffffff"
             text-anchor="middle">${kind}</text>
     </svg>`
  );
  await sharp(svg).png().toFile(filePath);
}

function ensureVideoPlaceholder(kind, filePath) {
  if (fs.existsSync(filePath)) return;
  // Generate a tiny 2s 9:16 test clip via ffmpeg; fall back to a marker file.
  const res = spawnSync(FFMPEG, [
    '-y',
    '-f', 'lavfi',
    '-i', `testsrc=duration=2:size=720x1280:rate=24`,
    '-pix_fmt', 'yuv420p',
    filePath,
  ], { stdio: 'ignore' });
  if (res.error || res.status !== 0 || !fs.existsSync(filePath)) {
    console.warn('[Mock] ffmpeg unavailable — writing non-playable placeholder for', kind);
    fs.writeFileSync(filePath, `mock ${kind} placeholder`);
  }
}

/**
 * Resolve (creating if needed) the deterministic placeholder for a generation kind.
 * @param {'isolate'|'tryon'|'compose'|'animate'} kind
 * @returns {Promise<{ resultUrl: string, mock: true }>}
 */
export async function mockResult(kind) {
  ensureDir();
  const spec = PLACEHOLDERS[kind] || PLACEHOLDERS.compose;
  const filePath = path.join(GENERATED_DIR, spec.file);
  if (spec.type === 'video') ensureVideoPlaceholder(kind, filePath);
  else await ensureImagePlaceholder(kind, filePath);
  const resultUrl = generatedUrl(spec.file);
  console.log(`[Mock] ${kind} → returning placeholder ${resultUrl}`);
  return { resultUrl, mock: true };
}
