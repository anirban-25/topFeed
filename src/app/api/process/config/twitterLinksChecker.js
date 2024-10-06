const axios = require('axios');
const admin = require('firebase-admin');

let db;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "topfeed-123",
        clientEmail: "firebase-adminsdk-6mx07@topfeed-123.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1OnfEjnPLfrSo\nOCujizCA5Qb8yg7rcztlyRkXaPI/a5IJeBw/m6kJM9j/uaYKo1Dx10V2CjB4Xc4S\nWCWfv3NZTb7VLZ2zAkIyd3lPNoRQMzTHvkCpTBxvTcTTtrhSkJTtFNnz1QKkHkEQ\n82G1IsFDux87zvAe3nq1PD3UwXzrk1KFUvsDOcfoOIQLuTswsWpW+uV6ouXS13ca\nk6Lm4kgAZnitLbKTLnfYJxBoFzx/i/UPlA0PAPjBgtBpF95xofbOe6+z/HNxivsb\nXRaX1AaPZ0tEVhXXVLcrrz9chEKdSXaK1gpd/V4xWexSexV2j2F2MgV9hDsS4SzR\nA82gTNZXAgMBAAECggEAV/cNvEPS09LoGIDPOb4taFsChcAD9ugDTDgMrE69yufJ\nRjxdJcjGBxf5+8JeZGp6NzDg39c5SKtrg37yoDQa5p10g9/03Dc772gLY1YYah84\nvr1LgIFXifULFSJrHHRePSdyVUau1f9zYKlp4zR/74LLucmLxsgBcqfPcU4LdwJF\nN5qgXbKlsWyrQ/qbDzxnZqXwL6TipT4NVKQ9QpflY+DF+B1D4dTH07zitJJI1Caq\nzhgUAsTN/XCpcqbTI61UgLT+mvS3XlaHoVvdIZBRPJI/MeJx2Ro9qQ9FVHnsR+ky\nR2xYYhYuEyTi1sTvOOz4LPN6t02HcVTeRwjdTUYiSQKBgQDlY1WUq5YlzYD1XkZq\nUXa5ro8/5JOvv4MxTWhCT9wumsPyVvEgQ2EhrRNLKz35Xeegy2MJ9Ek4NMjO7ChF\n4tjT/6IwbA/2kAU2dEy1aUl07oPnp2vlTfcvVqAT4bGZ/81O7hRudDpI9X1Bfoe1\n3fGQuaDcaYPlCJoN9Zr04RM1mQKBgQDKQNNhEYo7Tpnz1uQVFMheM4Bb2lXNjjcf\nmw9leekAxurrLtZg3bu5GA0E2MKSmkCPBjSPb8ZjhVZt1MQPThERiZVb878pKi13\nK692Nf5rpwhi1dWyyZvtDaOMpjOlnmcQd1+5EPpPBoW9nCNSSVVbg9qcLnbMtkcj\nyHPAp7sBbwKBgCaRZBNCIlWqztLyje5UUhz4L5ezi+1RyvIgLLZxjPi9BtMZMSOW\nkJ9D5WmPFLV3x3kumTFURHdR0K2R4VeWw5QpeBCiKrDvGCFGvpsF39bsP3tUl/yO\n9k+cRf/xw5W7/74Uo5TKr/4SYIQBjTnT3kjSHSzSBN4eayCLugkQStWJAoGAZmJa\nnxDaARvRI3btDx7uL4GywMzOErijfwRnzt7f7NzFnzienXqhxRk/vexc0wnzFHP3\nt4TF0St2jTLf7T9/tHkJevrxEk2fpmwe7qB2othzjlThURhuLppw6IpaKsT9N4C2\nnGDT1Z1fppSb7NPiuekNiXKcARVk/eBDeItwR1ECgYEAw4sCxMM2Z8iP030erkAn\nX53u/wfSWScsMvnTr/kCp2lILFlIVUGdtpoxbFzPj6e3mH+gOlcs4pOKSZshC3q3\n/H0zAF3fRq1i3mvKRRWIfouePytf5TfmV9hpL9RmaIfkGjWuNGthncRLqeDuWqVI\n68L1U5jvaM2RZmOlyS1nCqU=\n-----END PRIVATE KEY-----\n",
      }),
    });
  }
  db = admin.firestore();
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error; // Re-throw the error to stop execution if Firebase can't be initialized
}

async function  twitterLinksChecker(requestBody) {
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