// cron.ts

import cron from 'node-cron';
import moment from 'moment-timezone';
import { getMostFocusedTime } from './functions/getMostFocusedTime';

// Run every minute to check if it's exactly 6:25 AM PKT
cron.schedule('* * * * *', async () => {
  const now = moment().tz('Asia/Karachi');
  const isTargetTime = now.hour() === 8 && now.minute() === 34;

  if (isTargetTime) {
    console.log('⏰ It is 6:25 AM PKT — running focused time analysis...');
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
  '✅ Cron job scheduler initialized and watching for 6:25 AM PKT...'
);
