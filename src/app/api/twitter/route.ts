// src/app/api/twitter/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  const BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN;

  try {
    const response = await axios.get('https://api.twitter.com/2/tweets', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
