import { readMoodBoardConfig } from '@/lib/mood-board-data';

import { MoodBoardGallery } from './MoodBoardGallery';

export const dynamic = 'force-dynamic';

export default function MoodBoardsPage() {
  const config = readMoodBoardConfig();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="px-6 pb-4 pt-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight" style={{ textWrap: 'balance' }}>
            Mood Board Selection
          </h1>
          <p className="mt-2 text-lg text-white/50" style={{ textWrap: 'pretty' }}>
            {config.brief}
          </p>
          <p className="mt-1 text-sm text-white/30">
            Scroll through each direction below. Each shows the full design language, color palette, typography, and asset prompts. Click &quot;Choose This Direction&quot; to select.
          </p>
        </div>
      </div>

      <MoodBoardGallery options={config.options} initialSelectedId={config.selectedOptionId} />
    </main>
  );
}
