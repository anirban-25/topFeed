import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  console.log('Received request:', req.method); // Log HTTP method
  console.log('Request URL:', req.url); // Log request URL

  const webhookSecret = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SECRET;

  // Check if the secret is undefined and return an error if it is
  if (!webhookSecret) {
    console.error("Webhook secret is not set");
    return NextResponse.json({ message: 'Webhook secret is not configured' }, { status: 500 });
  }

  const signature = req.headers.get('x-signature') || req.headers.get('X-Signature');

  // Get the raw body as a string (don't parse it yet)
  const rawBody = await req.text(); // Get raw text body instead of JSON

  // Compute the expected signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret) // Now it's safe since webhookSecret is checked
    .update(rawBody) // Use raw body for signature verification
    .digest('hex');

  console.log('Expected Signature:', expectedSignature);
  console.log('Received Signature:', signature);

  // Verify the signature to confirm the request is from Lemon Squeezy
  if (expectedSignature !== signature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
  }

  try {
    const data = JSON.parse(rawBody); // Now parse the raw body as JSON after verification
    console.log("Webhook Payload:", data); // Log the webhook payload

    // You can perform other operations with the webhook data here if needed
    return NextResponse.json({ message: 'Webhook received successfully', data: data });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
