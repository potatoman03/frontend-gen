import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateRecraftImage } from './recraft-client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const configPath = path.join(rootDir, 'mood-board-options.json');
const outputDir = path.join(rootDir, 'public', 'mood-boards');

async function readConfig() {
  const raw = await fs.readFile(configPath, 'utf8');
  return JSON.parse(raw);
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

function toPublicPath(filePath) {
  const relative = path.relative(path.join(rootDir, 'public'), filePath);
  return `/${relative.split(path.sep).join('/')}`;
}

function detectExtension(buffer) {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return '.png';
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return '.jpg';
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return '.webp';
  return '.png';
}

async function persistResult(result, fileStem) {
  if (result.url && typeof result.url === 'string') {
    const response = await fetch(result.url);
    if (!response.ok) {
      throw new Error(`Failed to download mood board image (${response.status}).`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    const ext = detectExtension(bytes);
    const finalPath = path.join(outputDir, `${fileStem}${ext}`);
    await fs.writeFile(finalPath, bytes);
    return toPublicPath(finalPath);
  }

  if (result.base64 && typeof result.base64 === 'string') {
    const bytes = Buffer.from(result.base64, 'base64');
    const ext = detectExtension(bytes);
    const finalPath = path.join(outputDir, `${fileStem}${ext}`);
    await fs.writeFile(finalPath, bytes);
    return toPublicPath(finalPath);
  }

  throw new Error('Recraft result does not contain url or base64 data.');
}

async function main() {
  await ensureOutputDir();

  if (!process.env.RECRAFT_API_TOKEN) {
    console.error('[mood-boards] RECRAFT_API_TOKEN is missing. Writing failed status for all options.');
  }

  const config = await readConfig();

  const jobs = config.options.map((option) => ({
    id: option.id,
    run: async () => {
      if (!process.env.RECRAFT_API_TOKEN) {
        throw new Error('RECRAFT_API_TOKEN is missing.');
      }
      const result = await generateRecraftImage(option.moodBoardImage.prompt, '1024x1024');
      return persistResult(result, option.id);
    }
  }));

  const settled = await Promise.allSettled(jobs.map((j) => j.run()));

  for (let i = 0; i < jobs.length; i++) {
    const result = settled[i];
    const option = config.options.find((o) => o.id === jobs[i].id);

    if (result.status === 'fulfilled') {
      option.moodBoardImage.path = result.value;
      option.moodBoardImage.status = 'generated';
      console.log(`[mood-boards] ${option.id}: generated -> ${result.value}`);
    } else {
      option.moodBoardImage.status = 'failed';
      option.moodBoardImage.error =
        result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.error(`[mood-boards] ${option.id}: failed -> ${option.moodBoardImage.error}`);
    }
  }

  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');

  console.log('[mood-boards] mood-board-options.json updated.');
  console.log('[mood-boards] Summary:');
  for (const option of config.options) {
    const img = option.moodBoardImage;
    console.log(`  - ${option.id} (${option.label}): ${img.status}${img.path ? ` -> ${img.path}` : ''}`);
  }
}

main().catch((error) => {
  console.error('[mood-boards] Fatal failure:', error);
  process.exitCode = 1;
});
