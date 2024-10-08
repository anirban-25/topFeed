"use client";
import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const ManageSubscription = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const { customer_id, subscription_id } = userDoc.data();

          try {
            const response = await fetch(`https://api.lemonsqueezy.com/v1/customers/${customer_id}/subscriptions`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error('Failed to fetch subscription details');
            }

            const data = await response.json();
            const subscription = data.data.find(sub => sub.id === subscription_id);
            if (subscription) {
              setSubscriptionDetails(subscription);
            } else {
              setError('Subscription not found');
            }
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        } else {
          setError('User document not found');
          setLoading(false);
        }
      }
    };

    fetchSubscriptionDetails();
  }, [auth]);

  const handleCancelSubscription = async () => {
    if (!subscriptionDetails) return;

    try {
      const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionDetails.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Handle successful cancellation, e.g., show a message or redirect
        alert('Subscription cancelled successfully');
        // Optionally refresh the subscription details
        setSubscriptionDetails(null);
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Manage Subscription</h1>
      {subscriptionDetails && (
        <div>
          <p>Status: {subscriptionDetails.attributes.status}</p>
          <p>Plan: {subscriptionDetails.attributes.product_name}</p>
          <p>Trial: {subscriptionDetails.attributes.trial ? 'Yes' : 'No'}</p>
          <p>Days Remaining: {subscriptionDetails.attributes.days_remaining}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      )}
    </div>
  );
};

export default ManageSubscription;
