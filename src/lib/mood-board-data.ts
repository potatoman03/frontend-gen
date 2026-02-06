import { readFileSync } from 'fs';
import { join } from 'path';

import type { MoodBoardConfig } from './template-config';

const CONFIG_PATH = join(process.cwd(), 'mood-board-options.json');

export function readMoodBoardConfig(): MoodBoardConfig {
  const raw = readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw) as MoodBoardConfig;
}
