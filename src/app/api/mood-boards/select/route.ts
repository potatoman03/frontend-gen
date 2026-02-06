import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

import type { MoodBoardConfig } from '@/lib/template-config';

const CONFIG_PATH = join(process.cwd(), 'mood-board-options.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { optionId } = body;

    if (typeof optionId !== 'string' || !optionId) {
      return NextResponse.json({ error: 'optionId is required' }, { status: 400 });
    }

    const raw = readFileSync(CONFIG_PATH, 'utf-8');
    const config: MoodBoardConfig = JSON.parse(raw);

    const exists = config.options.some((o) => o.id === optionId);
    if (!exists) {
      return NextResponse.json({ error: `Unknown optionId: ${optionId}` }, { status: 400 });
    }

    config.selectedOptionId = optionId;
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');

    return NextResponse.json({ success: true, selectedOptionId: optionId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
