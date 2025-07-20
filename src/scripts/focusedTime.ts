// scripts/focusedTime.ts

import { getMostFocusedTime } from '../functions/getMostFocusedTime';
(async () => {
  console.log('🕒 Running scheduled focused time job');
  try {
    await getMostFocusedTime();
    console.log('✅ Focused time analysis completed successfully');
  } catch (err) {
    console.error('🚨 Error in focused time job:', err);
    process.exit(1);
  }
})();
