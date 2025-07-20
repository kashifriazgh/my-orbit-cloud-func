import cron from 'node-cron';
import { getMostFocusedTime } from './functions/getMostFocusedTime';

// 🕰 Runs every day at 5:52 AM (server time — usually UTC unless set)
cron.schedule('17 6 * * *', async () => {
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
  } catch (err) {
    console.error('🚨 Error running focused time task:', err);
  }
});
