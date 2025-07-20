import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import moment from 'moment-timezone';
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

export async function getMostFocusedTime() {
  for (const client of clients as Client[]) {
    try {
      const { projectId, firebase, clientName } = client;
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
      const now = moment().tz('Asia/Karachi');
      const thirtyDaysAgo = Timestamp.fromDate(
        now.clone().subtract(30, 'days').toDate()
      );

      const collectionsWithFields: [string, string[]][] = [
        ['ideas', ['createdAt']],
        ['todos', ['createdAt', 'updatedAt', 'completedAt']],
        ['journals', ['createdAt']],
        ['incomeSources', ['expectedDate', 'receivedAt']],
        ['expenditures', ['expectedDate', 'paidAt']],
        ['buyItems', ['createdAt', 'boughtAt']],
        ['cashTransactions', ['createdAt']],
        ['totalCashSnapshots', ['createdAt']],
      ];

      const usersSnapshot = await db.collection('users').get();
      const users = usersSnapshot.docs.map((doc) => ({ userId: doc.id }));

      for (const { userId } of users) {
        const userTimestamps: Date[] = [];

        for (const [collectionName, fields] of collectionsWithFields) {
          const snapshot = await db
            .collection(collectionName)
            .where('userId', '==', userId)
            .where('createdAt', '>=', thirtyDaysAgo)
            .get();

          snapshot.forEach((doc) => {
            const data = doc.data();
            for (const field of fields) {
              const ts = data[field];
              if (ts?.toDate) {
                userTimestamps.push(ts.toDate());
              }
            }
          });
        }

        if (userTimestamps.length === 0) continue;

        const hourlyCount = Array(24).fill(0);
        const dailyCount = Array(7).fill(0); // Sunday = 0

        for (const date of userTimestamps) {
          const m = moment(date).tz('Asia/Karachi');
          hourlyCount[m.hour()]++;
          dailyCount[m.day()]++;
        }

        const mostActiveHour = hourlyCount.indexOf(Math.max(...hourlyCount));
        const mostActiveDay = dailyCount.indexOf(Math.max(...dailyCount));

        const focusedTimePayload = {
          hourStart: mostActiveHour,
          hourEnd: (mostActiveHour + 1) % 24,
          day: moment().day(mostActiveDay).format('dddd'),
          updatedAt: Timestamp.now(),
        };

        await db.collection('pmc').doc(userId).set(
          {
            userId,
            focusedTime: focusedTimePayload,
          },
          { merge: true }
        );

        console.log(`✅ ${clientName}: Saved focused time for user ${userId}`);
      }
    } catch (error) {
      console.error(`❌ ${client.clientName} failed`, error);
    }
  }
}
