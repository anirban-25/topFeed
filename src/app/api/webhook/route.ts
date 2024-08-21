// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify webhook signature if necessary (you can implement signature verification here)

    // Extract relevant data from the webhook payload
    const { event, data } = body;

    // Handle different event types (e.g., successful payment)
    if (event === 'order.paid') {
      const { customer_email, order_id, product_id, amount } = data;

      // Store transaction details in Firestore
      await adminDb.collection('transactions').add({
        email: customer_email,
        order_id,
        product_id,
        amount,
        status: 'paid',
        created_at: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}
