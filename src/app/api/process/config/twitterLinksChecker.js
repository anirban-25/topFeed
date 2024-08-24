const axios = require('axios');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (if not already initialized elsewhere)
if (!admin.apps.length) {
  const serviceAccount = require('./firebase_service_account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

async function twitterLinksChecker(requestBody) {
  const { twitter_url } = requestBody;  
  console.log(twitter_url);

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
      return { message: "success", status: 200 };
    }

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

      // Save to Firestore
      await db.collection('all_tweet_feeds').add({
        twitter_url: twitter_url,
        rss_feed_url: new_feed_url
      });

      return { message: "success", status: 200 };
    } else {
      return { error: "RSS feed URL not found in the response", status: 500 };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: "Error fetching Twitter URL. Please try again", status: 500 };
  }
}

module.exports = twitterLinksChecker;