"use client";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '@/firebase';
import { useRouter } from 'next/navigation';

const ManageSubscription = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loaderInitial, setLoaderInitial] = useState(true);
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Watch authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the Firebase user when logged in
      } else {
        router.push("/login"); // Redirect to login if no user is found
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  // Fetch subscription details once user is available
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const { customer_id, subscription_id } = userDoc.data();
            console.log('Customer ID:', customer_id);
            console.log('Subscription ID:', subscription_id);

            const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscription_id}`, {
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
            setSubscriptionDetails(data.data);
          } else {
            setError('User document does not exist');
          }
        } catch (fetchError) {
          setError(fetchError.message);
        } finally {
          setLoaderInitial(false);
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchSubscriptionDetails();
    }
  }, [user]);
  if (loaderInitial) {
    return (
      <div className="flex items-center justify-center min-h-[90%]">
        <l-line-spinner
          size="40"
          stroke="3"
          speed="1"
          color="black"
        ></l-line-spinner>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[90%]">
        <div className=" text-center">
          <div>
            <l-cardio size="80" stroke="4" speed="2" color="black"></l-cardio>{" "}
          </div>
          <div>We are generating your feed!</div>
        </div>
        {/* Loader content */}
      </div>
    );
  }

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionDetails.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel the subscription');
      }

      alert('Subscription cancelled successfully.');
      setSubscriptionDetails((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, status: 'cancelled' },
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full font-kumbh-sans">
        <h2 className="text-2xl font-bold mb-6 text-center">Subscription Details</h2>
        {subscriptionDetails ? (
          <>
            <p><strong>Plan: </strong>{subscriptionDetails.attributes?.product_name || 'N/A'}</p>
            <p><strong>Status: </strong>{subscriptionDetails.attributes?.status_formatted || 'N/A'}</p>
            {subscriptionDetails.attributes?.trial_ends_at ? (
              <p><strong>Free Trial Ends at: </strong>{new Date(subscriptionDetails.attributes?.trial_ends_at).toLocaleString()}</p>
            ) : (
              <p>No trial period active.</p>
            )}
            {subscriptionDetails.attributes?.cancelled ? (
              <p className="mt-4 text-red-500 text-center">Your subscription has been cancelled.</p>
            ) : (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleCancelSubscription}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No subscription details available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageSubscription;
