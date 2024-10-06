import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase'; // Ensure Firebase config is imported correctly

export async function POST(req: Request) {
  const webhookSecret = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SECRET;

  if (!webhookSecret) {
    console.error('Webhook secret is not set');
    return NextResponse.json({ message: 'Webhook secret is not configured' }, { status: 500 });
  }

  const signature = req.headers.get('x-signature') || req.headers.get('X-Signature');
  
  if (!signature) {
    console.error('No signature found in request headers');
    return NextResponse.json({ message: 'Missing signature' }, { status: 403 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text(); // Get raw text body for signature verification
  } catch (error) {
    // Cast error to Error to properly handle it
    const errorMessage = (error as Error).message;
    console.error('Error reading request body:', errorMessage);
    return NextResponse.json({ message: `Error reading request body: ${errorMessage}` }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('Invalid signature: Received signature does not match expected signature');
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
  }

  try {
    const data = JSON.parse(rawBody); // Parse JSON after signature is verified
    const userEmail = data?.data?.attributes?.user_email;
    const plan = data?.data?.attributes?.status_formatted;

    if (!userEmail) {
      console.error('No user email found in webhook payload');
      return NextResponse.json({ message: 'No user email found' }, { status: 400 });
    }

    await setDoc(doc(db, 'users', userEmail), {
      hasPlan: plan || 'free',
    }, { merge: true });

    return NextResponse.json({ message: 'User plan updated successfully' });

  } catch (error) {
    // Properly cast error to the Error type and handle it
    const errorMessage = (error as Error).message;
    console.error('Error processing webhook:', errorMessage);
    return NextResponse.json({ message: `Error processing webhook: ${errorMessage}` }, { status: 500 });
  }
}
