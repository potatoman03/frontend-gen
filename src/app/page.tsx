import { redirect } from 'next/navigation';

import { readMoodBoardConfig } from '@/lib/mood-board-data';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const config = readMoodBoardConfig();

  // If no direction selected yet, send to mood board picker
  if (!config.selectedOptionId) {
    redirect('/mood-boards');
  }

  // Once a direction is selected, show the landing page
  redirect('/landing');
}
