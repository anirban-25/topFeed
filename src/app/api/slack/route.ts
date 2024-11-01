import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import fetch from 'node-fetch';

export async function POST(req: Request) {
  try {
    const { code, uuid } = await req.json();
    console.log("Authorization code received:", code);
    console.log("User UUID received:", uuid);
    if (!code || !uuid ) {
      return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
    }

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

    const tokenData = await tokenResponse.json();
    console.log("Slack response data:", tokenData);
    if (!tokenData.ok) {
      return NextResponse.json({ error: 'Failed to get Slack access token', details: tokenData }, { status: 400 });
    }

    const accessToken = tokenData.access_token || tokenData.authed_user?.access_token;
    const userId = tokenData.authed_user?.id;
    const teamName = tokenData.team?.name || '';  // Using team name as slackAccount

    const userDocRef = doc(db, 'notifications', uuid);
    await setDoc(userDocRef, {
      isslack: true,
      slackAccount: teamName,  // Save team name instead of username
      slackUserId: userId,
      accessToken,
    }, { merge: true });

    return NextResponse.json({ message: 'Slack user connected and data stored successfully', accessToken });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
