import { NextResponse } from 'next/server';
import { db } from '@/firebase'; 
import { doc, setDoc } from 'firebase/firestore';
import fetch from 'node-fetch';

export async function POST(req: Request) {
  try {
    // Extract authorization code from request
    const { code } = await req.json();
    console.log("Authorization code received:", code);

    if (!code) {
      console.error("Authorization code is missing");
      return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
    }

    // Exchange code for Slack access token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID as string,
        client_secret: process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET as string,
        code: code,
        redirect_uri: 'https://topfeed.ai/dashboard/notifications',
      }),
    });

    // Parse and log Slack's response
    const tokenData = await tokenResponse.json();
    console.log("Slack response data:", tokenData);

    if (!tokenData.ok) {
      console.error("Failed to get Slack access token:", tokenData.error);
      return NextResponse.json({ error: 'Failed to get Slack access token', details: tokenData }, { status: 400 });
    }

    const { authed_user } = tokenData;
    const accessToken = tokenData.access_token || tokenData.authed_user?.access_token;
    const userId = tokenData.authed_user?.id;
    const userName = tokenData.authed_user?.name || tokenData.user?.name;
    console.log("Authed user details:", { userId, userName, accessToken });

    // Save user data to Firestore
    const userDocRef = doc(db, 'notifications', userId);
    await setDoc(userDocRef, {
      isslack: true,
      slackAccount: userName,
      slackUserId: userId,
      accessToken,
    }, { merge: true });

    console.log("Slack user data stored successfully in Firestore for userId:", userId);

    return NextResponse.json({ message: 'Slack user connected and data stored successfully', accessToken });
  } catch (error) {
    console.error("Slack integration error:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
