import { db } from '../firebase';
import { collection, addDoc, doc } from 'firebase/firestore';

// Define the structure of the sub-headings
type SubHeading = {
  title: string;
  points: string[];
};

// Define the structure of the main headings
type Heading = {
  heading: string;
  sub_headings: SubHeading[];
};

// Define the structure for trends and questions
type TrendsAndQuestions = {
  title: string;
  points: string[];
};

// Define the overall structure of the API response
type APIResponseType = (Heading | TrendsAndQuestions)[];

// Function to store data under a specific user's subcollection
export async function storeDataInFirestore(data: APIResponseType, user: string) {
  if (!user) {
    console.error("No user ID provided.");
    return;
  }

  // Reference to the user's document within the users collection
  const userDocRef = doc(db, 'users', user);

  // Reference to the user's subcollection within the user's document
  const userRedditsCollectionRef = collection(userDocRef, 'user_reddits');

  try {
    console.log(`Storing data for user ${user}`);
    const docRef = await addDoc(userRedditsCollectionRef, {
      analysis: data,
      timestamp: new Date() // Adding a timestamp for the stored document
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error(`Error adding document for user ${user}:`, e);
    throw e; // Re-throw the error to be caught by the caller if needed
  }
}