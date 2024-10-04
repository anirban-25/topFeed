import { NextResponse } from 'next/server';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase'; // Ensure Firebase config is imported correctly

export async function POST(req: Request) {
  console.log('Received request:', req.method); // Log HTTP method
  console.log('Request URL:', req.url); // Log request URL

  const webhookSecret = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SECRET;
  const signature = req.headers.get('x-signature');

  // Verify the signature to confirm the request is from Lemon Squeezy
  if (signature !== webhookSecret) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
  }

  try {
    const data = await req.json(); // Parse the JSON body
    console.log("Webhook Payload:", data); 

    // Extract the userId from the metadata
    const userId = data.data.attributes.metadata.user_id; // Firebase userId passed via metadata
    const plan = data.data.attributes.product_name; // Extract the subscription plan name

    console.log(`User ID: ${userId}, Plan: ${plan}`); // Log user ID and plan

    if (!userId) {
      return NextResponse.json({ message: 'No user ID found in metadata' }, { status: 400 });
    }

    // Update the user document in Firestore with the subscription plan
    await setDoc(doc(db, 'users', userId), {
      plan: plan || 'free', // Default to 'free' if no plan is found
    }, { merge: true });

    return NextResponse.json({ message: 'User plan updated successfully' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
