import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase'; // Ensure Firebase config is imported correctly

export async function POST(req: Request) {
  // Retrieve the Lemon Squeezy webhook secret from environment variables
  const webhookSecret = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SECRET;

  // Check if the webhook secret is defined
  if (!webhookSecret) {
    console.error('Webhook secret is not set');
    return NextResponse.json({ message: 'Webhook secret is not configured' }, { status: 500 });
  }

  // Retrieve the x-signature header from the request
  const signature = req.headers.get('x-signature') || req.headers.get('X-Signature');

  // Get the raw body as a string (don't parse it yet)
  const rawBody = await req.text(); // Get raw text body instead of JSON for signature verification

  // Compute the expected signature using HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret) // Use the webhook secret for signature generation
    .update(rawBody) // Use raw body for signature verification
    .digest('hex');

  console.log('Expected Signature:', expectedSignature);
  console.log('Received Signature:', signature);

  // Verify the signature to confirm the request is from Lemon Squeezy
  if (expectedSignature !== signature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
  }

  try {
    // Parse the raw body as JSON after the signature is verified
    const data = JSON.parse(rawBody);
    console.log('Webhook Payload:', data); // Log the webhook payload for debugging

    // Extract the userId from the metadata passed by Lemon Squeezy
    const userId = data?.data?.id; // Firebase userId passed via metadata
    const plan = data?.data?.attributes?.product_name; // Extract the subscription plan name from webhook

    console.log(`User ID: ${userId}, Plan: ${plan}`); // Log the user ID and plan for debugging

    // If userId is not present, return a 400 Bad Request response
    if (!userId) {
      return NextResponse.json({ message: 'No user ID found in metadata' }, { status: 400 });
    }

    // Update the user document in Firestore with the new subscription plan
    await setDoc(doc(db, 'users', userId), {
      hasPlan: plan || 'free', // Set the user's subscription plan; default to 'free' if no plan is provided
    }, { merge: true }); // Use merge: true to update only the plan without overwriting other user data

    // Return a success response after successfully updating Firestore
    return NextResponse.json({ message: 'User plan updated successfully' });

  } catch (error) {
    // Log any error that occurs during processing
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
