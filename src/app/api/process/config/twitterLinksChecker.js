const axios = require('axios');
const admin = require('firebase-admin');

let db;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
  console.log(process.env.FIREBASE_PROJECT_ID,process.env.FIREBASE_CLIENT_EMAIL,process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"))
  db = admin.firestore();
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error; // Re-throw the error to stop execution if Firebase can't be initialized
}

async function twitterLinksChecker(requestBody) {
  const { twitter_url } = requestBody;  
  console.log('Received Twitter URL:', twitter_url);

  if (!twitter_url) {
    return { error: "No Twitter URL provided", status: 400 };
  }

  try {
    // Check if the Twitter URL already exists in Firestore
    const querySnapshot = await db.collection('all_tweet_feeds')
      .where('twitter_url', '==', twitter_url)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      console.log('Twitter URL already exists in Firestore');
      return { message: "success", status: 200 };
    }

    console.log('Twitter URL not found in Firestore, creating new RSS feed');

    // If not found, create a new RSS feed
    const response = await axios.post('https://api.rss.app/v1/feeds', {
      url: twitter_url
    }, {
      headers: {
        'Authorization': 'Bearer c_nNbfzK4dAWoTxY:s_WIHFi2i4TLEx6YFbNvitWY',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 && response.data.rss_feed_url) {
      const feed_id = response.data.rss_feed_url.split('/').pop().replace('.xml', '');
      const new_feed_url = `http://rss.app/feeds/v1.1/${feed_id}.json`;

      console.log('New RSS feed created:', new_feed_url);

      // Save to Firestore
      await db.collection('all_tweet_feeds').add({
        twitter_url: twitter_url,
        rss_feed_url: new_feed_url
      });

      console.log('New feed saved to Firestore');
      return { message: "success", status: 200 };
    } else {
      console.error('RSS feed URL not found in the response');
      return { error: "RSS feed URL not found in the response", status: 500 };
    }
  } catch (error) {
    console.error('Error in twitterLinksChecker:', error);
    return { error: "Error processing Twitter URL. Please try again", status: 500 };
  }
}

module.exports = twitterLinksChecker;