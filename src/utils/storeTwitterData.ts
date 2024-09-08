import { db } from '../firebase';
import { collection, addDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

type APIDataType = {
  content_html: string;
  relevancy: string;
  authors: { name: string }[];
  // Add any other fields you want to store
};
// Function to store data under a specific user's subcollection
export async function storeDataInFirestore(data: APIDataType[], userId: string) {
  if (!userId) {
    console.error("No user ID provided.");
    return;
  }

  const userDocRef = doc(db, 'users', userId);
  const userRedditsCollectionRef = collection(userDocRef, 'user_reddits');

  try {
    // Delete existing documents
    const querySnapshot = await getDocs(userRedditsCollectionRef);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Deleted ${querySnapshot.size} existing documents for user ${userId}`);

    // Store new data
    const addPromises = data.map(async (item, index) => {
      try {
        const docRef = await addDoc(userRedditsCollectionRef, {
          content_html: item.content_html,
          relevancy: item.relevancy,
          authors: item.authors,
          // Add other fields as needed
        });
        console.log(`Document ${index} written with ID: ${docRef.id}`);
      } catch (e) {
        console.error(`Error adding document for item ${index}:`, e);
      }
    });

    await Promise.all(addPromises);
    console.log(`Successfully stored ${data.length} items for user ${userId}`);
  } catch (e) {
    console.error(`Error in storeDataInFirestore for user ${userId}:`, e);
  }
}