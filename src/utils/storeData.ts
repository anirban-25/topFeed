// utils/storeData.ts

import { db } from '../firebase';
import { collection, addDoc, doc } from 'firebase/firestore';

type APIDataType = {
  content_html: string;
  relevancy: string;
  // Add any other fields expected from the API response
};

// Function to store data under a specific user's subcollection
export async function storeDataInFirestore(data: APIDataType[], userId: string) {
  if (!userId) {
    console.error("No user ID provided.");
    return;
  }

  // Reference to the user's document within the tweets collection
  const userDocRef = doc(db, 'tweets', userId);

  // Reference to the user's subcollection within the user's document
  const userTweetsCollectionRef = collection(userDocRef, 'user_tweets');

  // Store each item in the user's subcollection
  const promises = data.map(async (item, index) => {
    try {
      console.log(`Storing item ${index} for user ${userId}:`, item);
      const docRef = await addDoc(userTweetsCollectionRef, {
        content_html: item.content_html,
        relevancy: item.relevancy,
        // Add other fields to store if necessary
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error(`Error adding document for item ${index} for user ${userId}:`, e);
    }
  });

  await Promise.all(promises); // Ensure all promises complete
}
