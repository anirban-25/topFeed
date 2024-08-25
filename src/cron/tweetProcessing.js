const cron = require('node-cron');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');
const axios = require('axios');
const { parse } = require('node-html-parser');
const { parseISO, subHours } = 'date-fns';

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/your/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const MODEL = "gpt-4";
const api_key = 'your-openai-api-key';
const client = new OpenAI({ apiKey: api_key });

// Utility Functions (keep your existing utility functions here)
function extractLinks(text) {
  // ... (your existing function)
}

function excludeLinks(text) {
  // ... (your existing function)
}

async function fetchMetaTitle(url) {
  // ... (your existing function)
}

async function feedToGPT(filtered, newTopic) {
  // ... (your existing function)
}

async function fetchRssFeeds(urls, newTopic) {
  // ... (your existing function)
}

async function fetchFeeds(twitterUrls, newTopic) {
  // ... (your existing function)
}

// Function to process and store tweets for a single user
async function processAndStoreTweetsForUser(userId, twitterUrls, topic) {
  try {
    const dfFinal = await fetchFeeds(twitterUrls, topic);
    
    // Reference to the user's document within the tweets collection
    const userDocRef = db.collection('users').doc(userId);

    // Reference to the user's subcollection within the user's document
    const userTweetsCollectionRef = userDocRef.collection('user_tweets');

    // Delete existing documents in the subcollection
    const querySnapshot = await userTweetsCollectionRef.get();
    const batch = db.batch();
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted ${querySnapshot.size} existing documents for user ${userId}`);

    // Store each item in the user's subcollection
    const storePromises = dfFinal.map(async (item) => {
      try {
        await userTweetsCollectionRef.add({
          content_html: item.content_html,
          relevancy: item.relevancy,
          authors: item.authors.map(author => ({ name: author.name })),
          // Add other fields to store if necessary
        });
      } catch (e) {
        console.error(`Error adding document for user ${userId}:`, e);
      }
    });

    await Promise.all(storePromises);
    console.log(`Processed and stored tweets for user ${userId}`);
  } catch (error) {
    console.error(`Error processing and storing tweets for user ${userId}:`, error);
  }
}

// Main function to process all users
async function processTweetsForAllUsers() {
  try {
    const usersSnapshot = await db.collection('tweet_feed').get();

    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const userId = doc.id;
      const twitterUrls = userData.twitterUrls;
      const topic = userData.topic;

      await processAndStoreTweetsForUser(userId, twitterUrls, topic);
    }

    console.log('Finished processing tweets for all users');
  } catch (error) {
    console.error('Error in processTweetsForAllUsers:', error);
  }
}

// Schedule the cron job to run every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Running cron job to process tweets');
  await processTweetsForAllUsers();
});

// You can also expose an endpoint to manually trigger the process if needed
const express = require('express');
const app = express();

app.post('/api/manual-trigger', async (req, res) => {
  try {
    await processTweetsForAllUsers();
    res.status(200).json({ message: 'Manual processing completed successfully' });
  } catch (error) {
    console.error('Error in manual trigger:', error);
    res.status(500).json({ error: 'An error occurred during manual processing' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});