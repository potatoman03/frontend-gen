import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateRecraftImage, generateRecraftSvg } from './recraft-client.mjs';
import { generateTextToVideo } from './runway-client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const generationConfigPath = path.join(rootDir, 'generation-config.json');
const outputDir = path.join(rootDir, 'public', 'generated');
const manifestPath = path.join(rootDir, 'src', 'lib', 'asset-manifest.ts');

async function readGenerationConfig() {
  const raw = await fs.readFile(generationConfigPath, 'utf8');
  return JSON.parse(raw);
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

function inferExtensionFromUrl(url, fallback = '.bin') {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    return ext || fallback;
  } catch {
    return fallback;
  }
}

function toPublicPath(filePath) {
  const relative = path.relative(path.join(rootDir, 'public'), filePath);
  return `/${relative.split(path.sep).join('/')}`;
}

function postProcessSvg(svgContent, themeTextColor = '#eef1f5') {
  // Remove first <path> if its fill is white/near-white
  let processed = svgContent.replace(/<path\s[^>]*?>/, (match) => {
    const fillMatch = match.match(/fill="([^"]+)"/);
    if (!fillMatch) return match;
    const fill = fillMatch[1].toLowerCase().trim();
    if (fill === 'white' || fill === '#fff' || fill === '#ffffff') return '';
    const rgbMatch = fill.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgbMatch && Number(rgbMatch[1]) > 240 && Number(rgbMatch[2]) > 240 && Number(rgbMatch[3]) > 240) return '';
    return match;
  });

  // Replace dark fills with theme text color
  processed = processed.replace(/fill="([^"]+)"/g, (match, fill) => {
    const lower = fill.toLowerCase().trim();
    const hexMatch = lower.match(/^#([0-9a-f]{6})$/);
    if (hexMatch) {
      const r = parseInt(hexMatch[1].slice(0, 2), 16);
      const g = parseInt(hexMatch[1].slice(2, 4), 16);
      const b = parseInt(hexMatch[1].slice(4, 6), 16);
      if (r < 80 && g < 80 && b < 80) return `fill="${themeTextColor}"`;
    }
    const rgbMatch = lower.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgbMatch && Number(rgbMatch[1]) < 80 && Number(rgbMatch[2]) < 80 && Number(rgbMatch[3]) < 80) {
      return `fill="${themeTextColor}"`;
    }
    if (lower === '#000' || lower === '#000000' || lower === 'black') return `fill="${themeTextColor}"`;
    return match;
  });

  // Fix preserveAspectRatio
  processed = processed.replace(/preserveAspectRatio="none"/g, 'preserveAspectRatio="xMidYMid meet"');

  return processed;
}

function detectImageExtension(buffer) {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return '.png';
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return '.jpg';
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return '.webp';
  return '.png';
}

async function persistRecraftResult(result, fileStem, _preferredExt) {
  if (result.svg && typeof result.svg === 'string') {
    const finalPath = path.join(outputDir, `${fileStem}.svg`);
    await fs.writeFile(finalPath, postProcessSvg(result.svg), 'utf8');
    return toPublicPath(finalPath);
  }

  if (result.base64 && typeof result.base64 === 'string') {
    const bytes = Buffer.from(result.base64, 'base64');
    const ext = detectImageExtension(bytes);
    const finalPath = path.join(outputDir, `${fileStem}${ext}`);
    await fs.writeFile(finalPath, bytes);
    return toPublicPath(finalPath);
  }

  if (result.url && typeof result.url === 'string') {
    const response = await fetch(result.url);
    if (!response.ok) {
      throw new Error(`Failed to download generated asset ${result.url} (${response.status}).`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    const ext = detectImageExtension(bytes);
    const finalPath = path.join(outputDir, `${fileStem}${ext}`);
    await fs.writeFile(finalPath, bytes);
    return toPublicPath(finalPath);
  }

  throw new Error('Recraft result does not contain url, base64, or svg data.');
}

async function persistRunwayResult(result, fileStem) {
  if (!result.outputUrl) {
    throw new Error(`Runway outputUrl missing for task ${result.taskId}.`);
  }

  const ext = inferExtensionFromUrl(result.outputUrl, '.mp4');
  const finalPath = path.join(outputDir, `${fileStem}${ext}`);
  const response = await fetch(result.outputUrl);

  if (!response.ok) {
    throw new Error(`Failed to download Runway output ${result.outputUrl} (${response.status}).`);
  }

  const bytes = await response.arrayBuffer();
  await fs.writeFile(finalPath, Buffer.from(bytes));
  return toPublicPath(finalPath);
}

function makeGenerated(pathValue, prompt, provider) {
  return {
    path: pathValue,
    provider,
    status: 'generated',
    prompt
  };
}

function makeFailed(prompt, provider, error) {
  return {
    path: null,
    provider,
    status: 'failed',
    prompt,
    error: error instanceof Error ? error.message : String(error)
  };
}

function toManifestSource(brief, prompts, taskMap) {
  const logoTask = taskMap.logo;
  const heroImageTask = taskMap.heroImage;
  const walletTask = taskMap.featureWallet;
  const shieldTask = taskMap.featureShield;
  const rocketTask = taskMap.featureRocket;
  const heroVideoTask = taskMap.heroVideo;
  const showcaseVideoTask = taskMap.showcaseVideo;

  const manifest = {
    brief,
    generatedAt: new Date().toISOString(),
    assets: {
      logo: logoTask
        ? (logoTask.status === 'fulfilled'
          ? makeGenerated(logoTask.value, prompts.recraft.logo, 'recraft')
          : makeFailed(prompts.recraft.logo, 'recraft', logoTask.reason))
        : { path: null, provider: 'local', status: 'placeholder' },
      heroImage:
        heroImageTask.status === 'fulfilled'
          ? makeGenerated(heroImageTask.value, prompts.recraft.heroImage, 'recraft')
          : makeFailed(prompts.recraft.heroImage, 'recraft', heroImageTask.reason),
      featureIcons: {
        wallet:
          walletTask.status === 'fulfilled'
            ? makeGenerated(walletTask.value, prompts.recraft.featureIcons.wallet, 'recraft')
            : makeFailed(prompts.recraft.featureIcons.wallet, 'recraft', walletTask.reason),
        shield:
          shieldTask.status === 'fulfilled'
            ? makeGenerated(shieldTask.value, prompts.recraft.featureIcons.shield, 'recraft')
            : makeFailed(prompts.recraft.featureIcons.shield, 'recraft', shieldTask.reason),
        rocket:
          rocketTask.status === 'fulfilled'
            ? makeGenerated(rocketTask.value, prompts.recraft.featureIcons.rocket, 'recraft')
            : makeFailed(prompts.recraft.featureIcons.rocket, 'recraft', rocketTask.reason)
      },
      portfolioImages: (prompts.recraft.portfolioImages || []).map((prompt, i) => {
        const task = taskMap[`portfolio${i}`];
        if (!task) return { path: null, provider: 'local', status: 'placeholder' };
        return task.status === 'fulfilled'
          ? makeGenerated(task.value, prompt, 'recraft')
          : makeFailed(prompt, 'recraft', task.reason);
      }),
      scrollSequenceImages: (prompts.recraft.scrollSequenceImages || []).map((prompt, i) => {
        const task = taskMap[`scrollSequence${i}`];
        if (!task) return { path: null, provider: 'local', status: 'placeholder' };
        return task.status === 'fulfilled'
          ? makeGenerated(task.value, prompt, 'recraft')
          : makeFailed(prompt, 'recraft', task.reason);
      }),
      heroVideo:
        heroVideoTask.status === 'fulfilled'
          ? makeGenerated(heroVideoTask.value, prompts.runway.heroVideo, 'runway')
          : makeFailed(prompts.runway.heroVideo, 'runway', heroVideoTask.reason),
      showcaseVideo:
        showcaseVideoTask.status === 'fulfilled'
          ? makeGenerated(showcaseVideoTask.value, prompts.runway.showcaseVideo, 'runway')
          : makeFailed(prompts.runway.showcaseVideo, 'runway', showcaseVideoTask.reason)
    }
  };

  return manifest;
}

async function writeManifest(manifest) {
  const source = `import type { AssetManifest } from '@/lib/template-config';\n\nexport const assetManifest: AssetManifest = ${JSON.stringify(manifest, null, 2)};\n`;
  await fs.writeFile(manifestPath, source, 'utf8');
}

async function main() {
  await ensureOutputDir();

  const skipLogo = process.argv.includes('--skip-logo');

  const config = await readGenerationConfig();
  const { brief, prompts } = config;

  const jobs = [];

  if (!skipLogo) {
    jobs.push({
      key: 'logo',
      run: async () => {
        if (!process.env.RECRAFT_API_TOKEN) {
          throw new Error('RECRAFT_API_TOKEN is missing.');
        }
        const result = await generateRecraftSvg(prompts.recraft.logo);
        return persistRecraftResult(result, 'logo', '.svg');
      }
    });
  } else {
    console.log('[generate-assets] Skipping logo (--skip-logo flag)');
  }

  jobs.push(
    {
      key: 'heroImage',
      run: async () => {
        if (!process.env.RECRAFT_API_TOKEN) {
          throw new Error('RECRAFT_API_TOKEN is missing.');
        }
        const result = await generateRecraftImage(prompts.recraft.heroImage, '1536x1024');
        return persistRecraftResult(result, 'hero-image', '.png');
      }
    },
    {
      key: 'featureWallet',
      run: async () => {
        if (!process.env.RECRAFT_API_TOKEN) {
          throw new Error('RECRAFT_API_TOKEN is missing.');
        }
        const result = await generateRecraftSvg(prompts.recraft.featureIcons.wallet);
        return persistRecraftResult(result, 'feature-wallet', '.svg');
      }
    },
    {
      key: 'featureShield',
      run: async () => {
        if (!process.env.RECRAFT_API_TOKEN) {
          throw new Error('RECRAFT_API_TOKEN is missing.');
        }
        const result = await generateRecraftSvg(prompts.recraft.featureIcons.shield);
        return persistRecraftResult(result, 'feature-shield', '.svg');
      }
    },
    {
      key: 'featureRocket',
      run: async () => {
        if (!process.env.RECRAFT_API_TOKEN) {
          throw new Error('RECRAFT_API_TOKEN is missing.');
        }
        const result = await generateRecraftSvg(prompts.recraft.featureIcons.rocket);
        return persistRecraftResult(result, 'feature-rocket', '.svg');
      }
    },
    {
      key: 'heroVideo',
      run: async () => {
        if (!process.env.RUNWAY_API_KEY) {
          throw new Error('RUNWAY_API_KEY is missing.');
        }
        const result = await generateTextToVideo(prompts.runway.heroVideo, {
          pollIntervalMs: 10_000,
          timeoutMs: 300_000
        });
        return persistRunwayResult(result, 'hero-video');
      }
    },
    {
      key: 'showcaseVideo',
      run: async () => {
        if (!process.env.RUNWAY_API_KEY) {
          throw new Error('RUNWAY_API_KEY is missing.');
        }
        const result = await generateTextToVideo(prompts.runway.showcaseVideo, {
          pollIntervalMs: 10_000,
          timeoutMs: 300_000
        });
        return persistRunwayResult(result, 'showcase-video');
      }
    }
  );

  if (prompts.recraft.portfolioImages) {
    prompts.recraft.portfolioImages.forEach((prompt, i) => {
      jobs.push({
        key: `portfolio${i}`,
        run: async () => {
          if (!process.env.RECRAFT_API_TOKEN) throw new Error('RECRAFT_API_TOKEN is missing.');
          const result = await generateRecraftImage(prompt, '1536x1024');
          return persistRecraftResult(result, `portfolio-${i}`, '.png');
        }
      });
    });
  }

  if (prompts.recraft.scrollSequenceImages) {
    prompts.recraft.scrollSequenceImages.forEach((prompt, i) => {
      jobs.push({
        key: `scrollSequence${i}`,
        run: async () => {
          if (!process.env.RECRAFT_API_TOKEN) throw new Error('RECRAFT_API_TOKEN is missing.');
          const result = await generateRecraftImage(prompt, '1536x1024');
          return persistRecraftResult(result, `scroll-sequence-${i}`, '.png');
        }
      });
    });
  }

  // Recraft and Runway jobs are started together; partial failure still writes a manifest.
  const settledResults = await Promise.allSettled(jobs.map((job) => job.run()));

  const taskMap = jobs.reduce((accumulator, job, index) => {
    const result = settledResults[index];
    accumulator[job.key] = result;

    if (result.status === 'rejected') {
      const reason = result.reason instanceof Error ? result.reason.message : result.reason;
      console.error(`[generate-assets] ${job.key} failed: ${reason}`);
    }

    return accumulator;
  }, {});

  const manifest = toManifestSource(brief, prompts, taskMap);
  await writeManifest(manifest);

  console.log('[generate-assets] Manifest updated at src/lib/asset-manifest.ts');
  console.log('[generate-assets] Task summary:');
  for (const [key, result] of Object.entries(taskMap)) {
    if (result.status === 'fulfilled') {
      console.log(`  - ${key}: generated -> ${result.value}`);
    } else {
      console.log(`  - ${key}: failed -> ${result.reason instanceof Error ? result.reason.message : result.reason}`);
    }
  }
}

main().catch((error) => {
  console.error('[generate-assets] Fatal failure:', error);
  process.exitCode = 1;
});
