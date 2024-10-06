import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('Received request:', req.method); // Log HTTP method
  console.log('Request URL:', req.url); // Log request URL

  const webhookSecret = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SECRET;
  const signature = req.headers.get('x-signature');

  // Verify the signature to confirm the request is from Lemon Squeezy
  console.log(signature)
  console.log(webhookSecret)
  if (signature !== webhookSecret) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
  }

  try {
    const data = await req.json(); // Parse the JSON body
    console.log("Webhook Payload:", data); // Log the webhook payload

    // You can perform other operations with the webhook data here if needed
    // For now, we'll just log the payload and return a success response

    return NextResponse.json({ message: 'Webhook received successfully', data: data });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}