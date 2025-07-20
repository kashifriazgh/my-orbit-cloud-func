// cron.ts

import cron from 'node-cron';
import moment from 'moment-timezone';
import { getMostFocusedTime } from './functions/getMostFocusedTime';

// Run every minute to check if it's exactly 8:45, 8:46, or 8:47 AM PKT
cron.schedule('* * * * *', async () => {
  const now = moment().tz('Asia/Karachi');
  const hour = now.hour();
  const minute = now.minute();

  const shouldRun = hour === 9 && (minute === 10 || minute === 11);

  if (shouldRun) {
    console.log(
      `⏰ It is ${now.format('HH:mm')} PKT — running focused time analysis...`
    );
    try {
      await getMostFocusedTime();
      console.log('✅ Focused time task completed');
    } catch (err) {
      console.error('🚨 Error running focused time task:', err);
    }
  } else {
    console.log(`🕒 Current time in PKT: ${now.format('HH:mm')}`);
  }
});

// 👇 Keep the Node.js process alive
setInterval(() => {}, 1000 * 60 * 60); // 1 hour

console.log(
  '✅ Cron job scheduler initialized and watching for 8:45–8:47 AM PKT...'
);
