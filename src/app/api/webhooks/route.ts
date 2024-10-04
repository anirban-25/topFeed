import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('Received POST request:', req.method, req.url);

  try {
    const data = await req.json(); // Parse the request body
    console.log("Webhook Payload:", data);
    
    return NextResponse.json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
