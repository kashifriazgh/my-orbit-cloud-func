// cron.ts

import cron from 'node-cron';
import { getMostFocusedTime } from './functions/getMostFocusedTime';

cron.schedule('25 6 * * *', async () => {
  const now = new Date();
  const timeInKarachi = now.toLocaleTimeString('en-PK', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  console.log(`⏰ ${timeInKarachi} PKT — running focused time analysis...`);

  try {
    await getMostFocusedTime();
    console.log('✅ Focused time task completed');
  } catch (err) {
    console.error('🚨 Error running focused time task:', err);
  }
});

// 👇 Add this to keep the Node.js process alive
setInterval(() => {}, 1000 * 60 * 60); // Keep process alive for an hour
console.log('✅ Cron job scheduler initialized and running...');
