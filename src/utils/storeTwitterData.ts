import { db } from '../firebase';
import { collection, addDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

type APIDataType = {
  content_html: string;
  relevancy: string;
  authors: { name: string }[];
  // Add any other fields expected from the API response
};

// Function to store data under a specific user's subcollection
export async function storeDataInFirestore(data: APIDataType[], userId: string) {
  if (!userId) {
    console.error("No user ID provided.");
    return;
  }

  // Reference to the user's document within the tweets collection
  const userDocRef = doc(db, 'users', userId);

  // Reference to the user's subcollection within the user's document
  const userTweetsCollectionRef = collection(userDocRef, 'user_tweets');

  // Delete existing documents in the subcollection
  try {
    const querySnapshot = await getDocs(userTweetsCollectionRef);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Deleted ${querySnapshot.size} existing documents for user ${userId}`);
  } catch (e) {
    console.error(`Error deleting existing documents for user ${userId}:`, e);
  }

  // Store each item in the user's subcollection
  const promises = data.map(async (item, index) => {
    try {
      console.log(`Storing item ${index} for user ${userId}:`, item);
      const docRef = await addDoc(userTweetsCollectionRef, {
        content_html: item.content_html,
        relevancy: item.relevancy,
        authors: item.authors.map(author => ({ name: author.name })),
        // Add other fields to store if necessary
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error(`Error adding document for item ${index} for user ${userId}:`, e);
    }
  });

  await Promise.all(promises); // Ensure all promises complete
}