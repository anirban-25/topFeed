import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, increment } from 'firebase/firestore';

type SubHeading = {
  title: string;
  points: string[];
};

type Heading = {
  heading: string;
  sub_headings: SubHeading[];
};

type TrendsAndQuestions = {
  title: string;
  points: string[];
};

type APIResponseType = (Heading | TrendsAndQuestions)[];

export async function storeDataInFirestore(data: APIResponseType, user: string, subreddits: string[], isRefresh: boolean = false) {
  if (!user) {
    console.error("No user ID provided.");
    return;
  }

  const userDocRef = doc(db, 'users', user);
  const userRedditsCollectionRef = collection(userDocRef, 'user_reddits');
  const latestDocRef = doc(userRedditsCollectionRef, 'latest_analysis');

  try {
    console.log(`Storing data for user ${user}`);
    await setDoc(latestDocRef, {
      analysis: data,
      subreddits: subreddits,
      timestamp: new Date(),
    }, { merge: true });  // This will overwrite existing fields

    if (isRefresh) {
      await updateDoc(userDocRef, {
        refreshCount: increment(1),
      });
    }

    console.log("Document updated with ID: ", latestDocRef.id);
    return latestDocRef;
  } catch (e) {
    console.error(`Error updating document for user ${user}:`, e);
    throw e;
  }
}
