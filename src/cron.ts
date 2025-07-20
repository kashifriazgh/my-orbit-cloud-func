import cron from 'node-cron';
import moment from 'moment-timezone';
import { getMostFocusedTime } from './functions/getMostFocusedTime';

cron.schedule('5 52 * * *', async () => {
  const now = moment().tz('Asia/Karachi');

  if (!now.isValid()) {
    console.error('❌ Invalid moment-timezone result — aborting task.');
    return;
  }

  console.log(
    `⏰ ${now.format('HH:mm')} PKT — running focused time analysis...`
  );
  await getMostFocusedTime();
});
