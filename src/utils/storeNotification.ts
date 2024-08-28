import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

type NotificationData = {
  istelegram: boolean;
  telegramAccount: string;
  isActive: boolean;
  twitter: boolean;
  reddit: boolean;
};

export async function storeNotificationData(user: string, notificationData: NotificationData) {
  if (!user) {
    console.error("No user ID provided.");
    return;
  }

  const notificationDocRef = doc(db, 'notifications', user);

  try {
    console.log(`Storing notification data for user ${user}`);
    await setDoc(notificationDocRef, notificationData, { merge: true }); 

    console.log("Notification data stored successfully for user: ", user);
    return notificationDocRef;
  } catch (e) {
    console.error(`Error storing notification data for user ${user}:`, e);
    throw e;
  }
}
