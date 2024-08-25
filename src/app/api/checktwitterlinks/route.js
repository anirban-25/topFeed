import { NextResponse } from 'next/server';
import twitterLinksChecker from '../process/config/twitterLinksChecker';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await twitterLinksChecker(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}