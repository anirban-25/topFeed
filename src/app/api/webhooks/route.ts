import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Ensure Firebase config is imported correctly

export async function POST(req: Request) {
  const webhookSecret = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_SECRET;

  if (!webhookSecret) {
    console.error('Webhook secret is not set');
    return NextResponse.json({ message: 'Webhook secret is not configured' }, { status: 500 });
  }

  const signature = req.headers.get('x-signature') || req.headers.get('X-Signature');
  const rawBody = await req.text();

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
  }

  try {
    const data = JSON.parse(rawBody);

    const userId = data?.meta?.custom_data?.user_id; // Firebase userId from metadata
    const eventType = data?.meta?.event_name; // Extract the event type from the webhook payload

    if (!userId) {
      return NextResponse.json({ message: 'No user ID found in metadata' }, { status: 400 });
    }

    if (eventType === 'subscription_cancelled' || eventType === 'subscription_deleted') {
      // Handle subscription cancellation or deletion
      console.log(`Handling ${eventType} event for user: ${userId}`);
      
      // Optionally update the user's plan status in Firebase or delete the subscription
      await setDoc(doc(db, 'users', userId), {
        plan: 'free', // Downgrade plan to 'free' upon cancellation or deletion
        subscription_id: '', // Clear subscription ID
      }, { merge: true });
      
      // You can also choose to delete the user's document or subscription info entirely:
      // await deleteDoc(doc(db, 'users', userId));

    } else {
      // For other events, continue updating the user's plan/subscription
      const plan = data?.data?.attributes?.product_name;
      const customer_id = data?.data?.attributes?.customer_id;
      const subscription_id = data?.data?.attributes?.first_subscription_item?.subscription_id;

      console.log(`Handling ${eventType} event for user: ${userId}, Plan: ${plan}`);

      await setDoc(doc(db, 'users', userId), {
        plan: plan || 'free',
        customer_id: customer_id || '',
        subscription_id: subscription_id || '',
      }, { merge: true });
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
