import { updateAllClients } from './updateClients';

(async () => {
  console.log('🔄 Running scheduled update...');
  await updateAllClients();
  console.log('✅ Done!');
})();
