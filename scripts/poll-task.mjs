import { pollRunwayTask } from './runway-client.mjs';

async function main() {
  const taskId = process.argv[2];

  if (!taskId) {
    console.error('Usage: node scripts/poll-task.mjs <task-id>');
    process.exit(1);
  }

  try {
    const result = await pollRunwayTask(taskId, {
      pollIntervalMs: 5_000,
      timeoutMs: 120_000
    });
    console.log('Runway task complete:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Runway task polling failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

main();
