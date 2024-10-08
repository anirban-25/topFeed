import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase'; 

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

    const userId = data?.meta?.custom_data?.user_id; 
    const plan = data?.data?.attributes?.product_name; 
    const customer_id = data?.data?.attributes?.customer_id;
    const subscription_id = data?.data?.attributes?.first_subscription_item?.subscription_id;
    const isCancelled = data?.data?.attributes?.cancelled; // Check if the subscription is cancelled

    if (!userId) {
      return NextResponse.json({ message: 'No user ID found in metadata' }, { status: 400 });
    }

    // If subscription is cancelled, update the user's plan to 'free'
    if (isCancelled) {
      await setDoc(doc(db, 'users', userId), {
        plan: 'free',
        customer_id: '',
        subscription_id: '',
      }, { merge: true }); 
    } else {
      // Otherwise, update with the current subscription plan
      await setDoc(doc(db, 'users', userId), {
        plan: plan || 'free', 
        customer_id: customer_id || '',
        subscription_id: subscription_id || '',
      }, { merge: true });
    }

    return NextResponse.json({ message: 'User plan updated successfully' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
