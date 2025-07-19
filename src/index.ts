import { updateAllClients } from './functions/updateClients';

(async () => {
  console.log('🔄 Running scheduled update...');
  await updateAllClients();
  console.log('✅ Done!');
})();
