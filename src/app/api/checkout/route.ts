// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase-admin';
import axios from 'axios';

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;

export async function POST(request: Request) {
  try {
    const { productId, userToken } = await request.json();

    // Verify Firebase Auth Token on the server
    const decodedToken = await adminAuth.verifyIdToken(userToken);

    // Use Firestore via Firebase Admin
    const userRef = adminDb.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Create checkout session with Lemon Squeezy
    const response = await axios.post(
      'https://api.lemonsqueezy.com/v1/checkouts',
      {
        product_id: productId,
        email: decodedToken.email,
      },
      {
        headers: {
          Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Send the checkout URL to the frontend
    return NextResponse.json({ url: response.data.checkout_url });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
