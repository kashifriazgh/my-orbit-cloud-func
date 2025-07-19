import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import clients from '../../clients.json';

interface Client {
  projectId: string;
  clientName: string;
  firebase: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
}

export async function updateAllClients() {
  for (const client of clients as Client[]) {
    try {
      const { projectId, firebase } = client;

      const appName = `app-${projectId}`;
      const alreadyInitialized = getApps().find((app) => app.name === appName);

      const app =
        alreadyInitialized ||
        initializeApp(
          {
            credential: cert({
              projectId: firebase.projectId,
              clientEmail: firebase.clientEmail,
              privateKey: firebase.privateKey.replace(/\\n/g, '\n'),
            }),
          },
          appName
        );

      const db = getFirestore(app);

      // Define the collection and doc
      const collectionName = 'test-collection';
      const docId = 'scheduled-task';
      const currentTime = new Date().toISOString();

      await db.collection(collectionName).doc(docId).set(
        {
          triggeredAt: currentTime,
        },
        { merge: true }
      );

      console.log(`✅ Updated ${client.clientName} at ${currentTime}`);
    } catch (error) {
      console.error(`❌ Error for ${client.clientName}`, error);
    }
  }
}
