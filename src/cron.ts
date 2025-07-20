import cron from 'node-cron';
import moment from 'moment-timezone';
import { getMostFocusedTime } from './functions/getMostFocusedTime';

// Run every minute to check if it's 9:13 or 9:14 AM PKT
cron.schedule('* * * * *', async () => {
  const now = moment().tz('Asia/Karachi');
  const hour = now.hour();
  const minute = now.minute();

  const shouldRun = hour === 10 && (minute === 32 || minute === 33);

  if (shouldRun) {
    console.log(
      `⏰ It is ${now.format('HH:mm')} PKT — running focused time analysis...`
    );

    try {
      await getMostFocusedTime();
      console.log('✅ Focused time task completed');
    } catch (err: any) {
      console.error('🚨 Error running focused time task:', err.message);

      // 🔍 Detect Firestore missing index error
      if (err.code === 9 && err.message.includes('index')) {
        console.warn('⚠️ Missing index detected!');
        console.warn(
          '🔗 Create index here:',
          err.message.match(/https?:\/\/[^\s]+/g)?.[0]
        );
      }

      // Optional: log full error stack
      console.error(err.stack);
    }
  } else {
    console.log(`🕒 Current time in PKT: ${now.format('HH:mm')}`);
  }
});

// 👇 Prevent app from exiting
setInterval(() => {}, 1000 * 60 * 60); // 1 hour

console.log(
  '✅ Cron job scheduler initialized and watching for 9:13–9:14 AM PKT...'
);
