import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase'; // Import db directly
import { doc, setDoc } from 'firebase/firestore';
import fetch from 'node-fetch';

// Main API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    // Exchange code for Slack access token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID as string,
        client_secret: process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET as string,
        code: code as string,
        redirect_uri: 'https://topfeed.ai/dashboard/notifications',
      }),
    });
    const tokenData = await tokenResponse.json();

    if (!tokenData.ok) {
      return res.status(400).json({ error: 'Failed to get Slack access token', details: tokenData });
    }

    const { authed_user } = tokenData;
    const accessToken = authed_user.access_token;
    const userId = authed_user.id;
    const userName = authed_user.name;

    // Save user data to Firestore
    const userDocRef = doc(db, 'notifications', userId); 
    await setDoc(userDocRef, {
      isslack: true,
      slackAccount: userName,
      slackUserId: userId,
      accessToken,
    }, { merge: true });

    res.status(200).json({ message: 'Slack user connected and data stored successfully', accessToken });
  } catch (error) {
    console.error('Slack integration error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
