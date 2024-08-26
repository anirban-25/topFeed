import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

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

  try {
    console.log(`Storing data for user ${user}`);
    const docRef = await addDoc(userRedditsCollectionRef, {
      analysis: data,
      subreddits: subreddits,
      timestamp: new Date(),
    });

    if (isRefresh) {
      await updateDoc(userDocRef, {
        refreshCount: increment(1),
      });
    }

    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error(`Error adding document for user ${user}:`, e);
    throw e;
  }
}
