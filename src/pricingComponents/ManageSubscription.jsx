"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, app } from "@/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { Drawer } from "@material-tailwind/react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const ManageSubscription = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loaderInitial, setLoaderInitial] = useState(true);
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [openSidePanel, setOpenSidePanel] = useState(false);
  const openDrawer = () => setOpenSidePanel(true);
  const closeDrawer = () => setOpenSidePanel(false);
  const World = dynamic(
    () => import("../components/ui/globe").then((m) => m.World),
    {
      ssr: false,
    }
  );

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
  ];

  useEffect(() => {
    import("ldrs").then(({ cardio }) => {
      cardio.register();
    });
    import("ldrs").then(({ lineSpinner }) => {
      lineSpinner.register();
    });
  }, []);

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

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  // Fetch subscription details once user is available
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const { customer_id, subscription_id } = userDoc.data();
            console.log("Customer ID:", customer_id);
            console.log("Subscription ID:", subscription_id);

            const response = await fetch(
              `https://api.lemonsqueezy.com/v1/subscriptions/${subscription_id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch subscription details");
            }

            const data = await response.json();
            setSubscriptionDetails(data.data[0] || data.data);
            console.log(data.data);
          } else {
            setError("User document does not exist");
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
  // if (loaderInitial) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[90%]">
  //       <l-line-spinner
  //         size="40"
  //         stroke="3"
  //         speed="1"
  //         color="black"
  //       ></l-line-spinner>
  //     </div>
  //   );
  // }
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[90%]">
  //       <div className=" text-center">
  //         <div>
  //           <l-cardio size="80" stroke="4" speed="2" color="black"></l-cardio>{" "}
  //         </div>
  //         <div>We are generating your feed!</div>
  //       </div>
  //       {/* Loader content */}
  //     </div>
  //   );
  // }

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    try {
      const response = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionDetails.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel the subscription");
      }

      alert("Subscription cancelled successfully.");
      setSubscriptionDetails((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, status: "cancelled" },
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      handleOpen();
    }
  };

  // if (loading) return <p className="text-white text-3xl">Loading...</p>;

  // if (error) return <p className="text-white">{error}</p>;

  return (
    <div className="min-h-screen items-center h-full ">
      <div className="flex justify-between w-full bg-white bg-opacity-5 mb-5 md:p-5 py-3 items-center">
        <div className="hidden md:flex">{""}</div>
        <div className="flex md:hidden font-kumbh-sans-bold text-xl text-[#8D8D8D] font-semibold ">
          <button
            onClick={openDrawer}
            className="flex md:hidden  bg-[#4c448a] text-white py-2 text-base ring-2 ring-blue-200  font-kumbh-sans-regular px-4 rounded-r-full  "
          >
            Subscriptions
          </button>
          <Drawer
            open={openSidePanel}
            onClose={closeDrawer}
            className=" bg-transparent w-[10rem]"
          >
            <div className="space-y-10  border-[#4c448a] border-l-[10px] ">
              <div className=" bg-transparent text-center py-8 rounded-r-full text-black font-kumbh-sans-medium "></div>
              <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
                <Link href="/dashboard/reddit">Reddit</Link>
              </div>
              <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
                <Link href="/dashboard/twitter">Twitter</Link>
              </div>
              <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
                <Link href="/dashboard/notifications">Notification</Link>
              </div>
              <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white  border-l-transparent border-4 border-white font-kumbh-sans-regular ">
                <Link href="/dashboard/manage-subscription">Subscriptions</Link>
              </div>
              <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
                <Link href="/pricing">Pricing</Link>
              </div>
            </div>
          </Drawer>
        </div>
        <div className="hidden md:flex text-white font-bold text-lg md:text-xl tracking-[.25rem] md:tracking-[1rem]  ">
          SUBSCRIPTION
        </div>
        <div className="flex mr-3 md:mr-0 justify-end text-white font-bold text-base  ">
          <UserMenu />
        </div>
      </div>
      {loading ? (
        <div className=" h-full flex items-center justify-center min-h-[90%]">
          <l-line-spinner
            size="40"
            stroke="3"
            speed="1"
            color="white"
          ></l-line-spinner>
        </div>
      ) : (
        <div>
          <div className="absolute top-0 right-12 z-10 gradient-02 w-96 h-96" />
          <div className="md:flex z-30 md:justify-between items-center p-5">
            <div className=" items-center ">
              <div className=" mb-20 Ztext-white text-xl font-kumbh-sans-bold">
                <div className="text-white border-2 border-blue-500 shadow-[0_5px_60px_-15px_rgba(0,0,0,0.3)] shadow-blue-900 rounded-lg p-8  md:max-w-lg w-full md:max-h-[35vh] h-lg font-kumbh-sans relative overflow-hidden">
                  <div className="absolute inset-0 ">
                    <Image
                      src="/images/bg-pattern.svg"
                      layout="fill"
                      objectFit="cover"
                      alt="bg"
                      className="mx-auto bg-gray-900"
                    />
                    <Image
                      src="/images/ellipse-1.svg"
                      layout="fill"
                      objectFit="contain"
                      alt="bg"
                      className="mx-auto absolute left-0 -top-10"
                    />
                    <Image
                      src="/images/ellipse-2.svg"
                      layout="fill"
                      objectFit="contain"
                      alt="bg"
                      className="mx-auto absolute left-0 top-0 blur-md"
                    />
                    <Image
                      src="/images/circle.png"
                      layout="fill"
                      objectFit="contain"
                      alt="bg"
                      className="mx-auto absolute w-[234px] md:w-[800px] top-10 left-20 md:left-36 md:top-0"
                    />
                  </div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#9d96d6] text-lg md:text-2xl font-kumbh-sans-bold mb-6 text-center relative z-10">
                    Subscription Details
                  </h2>
                  {subscriptionDetails ? (
                    <div className="relative z-10 text-base font-kumbh-sans-medium">
                      <p>
                        <strong>Plan: </strong>
                        {subscriptionDetails.attributes?.product_name || "N/A"}
                      </p>
                      <p>
                        <strong>Status: </strong>
                        {subscriptionDetails.attributes?.status_formatted ||
                          "N/A"}
                      </p>
                      {subscriptionDetails.attributes?.trial_ends_at ? (
                        <p>
                          <strong>Free Trial Ends at: </strong>
                          {new Date(
                            subscriptionDetails.attributes?.trial_ends_at
                          ).toLocaleString()}
                        </p>
                      ) : (
                        <p>No trial period active.</p>
                      )}
                      {subscriptionDetails?.attributes?.cancelled ? (
                        <div>
                          <div className="mt-4 text-red-500 text-center">
                            Your subscription has been cancelled.
                          </div>
                          <div>
                            <Link href="/pricing">
                              <button className="bg-green-700 hover:bg-green-800  duration-200 font-kumbh-sans-light text-xs  transition-colors text-white font-bold py-2 px-4 rounded">
                                Change Subscription
                              </button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center mt-6 gap-x-5">
                          {subscriptionDetails.attributes?.product_name && (
                            <button
                              onClick={handleOpen}
                              className="bg-red-500 hover:bg-red-700  duration-200 font-kumbh-sans-light text-xs  transition-colors text-white font-bold py-2 px-4 rounded"
                            >
                              Cancel Subscription
                            </button>
                          )}
                          <Dialog
                            open={open}
                            handler={handleOpen}
                            className="px-5"
                          >
                            <div className="font-kumbh-sans-bold my-5 text-base text-black ">
                              Are you sure you would like to cancel?
                            </div>
                            <div className="text-sm text-gray-700 font-kumbh-sans-medium">
                              Please note that upon cancellation, you will
                              forfeit all remaining benefits of your current
                              plan, regardless of the time left in your
                              subscription.
                            </div>
                            <div className="flex justify-center my-5 gap-x-3">
                              <button
                                onClick={handleCancelSubscription}
                                className="mr-1 text-xs bg-red-700 font-kumbh-sans-medium text-white rounded-md p-2 px-4 transition-all duration-200 hover:bg-red-800"
                              >
                                <span>Yes, Cancel my subscription</span>
                              </button>
                              <button
                                onClick={handleOpen}
                                className=" text-xs bg-green-700 font-kumbh-sans-medium text-white rounded-md p-2 px-4 transition-all duration-200 hover:bg-green-800"
                              >
                                <span>No, Keep my subscription</span>
                              </button>
                            </div>
                          </Dialog>
                          <Link href="/pricing">
                            <button className="bg-green-700 hover:bg-green-800  duration-200 font-kumbh-sans-light text-xs  transition-colors text-white font-bold py-2 px-4 rounded">
                              Change Subscription
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="relative z-10">
                      No subscription details available.
                    </p>
                  )}
                </div>
              </div>
              <div className=" text-white font-kumbh-sans-bold text-2xl">
                What your plan offers 🚀
                <br />
                <br />
                <div className=" font-kumbh-sans-regular text-base text-gray-400">
                  {subscriptionDetails?.attributes?.product_name === "free" ? (
                    <div>
                      <div>• 10 Instant Reddit Feed Refreshes/month</div>{" "}
                      <div>• Add 3 Twitter Accounts</div>
                      <div>• 30 mins Twitter Autorefresh</div>{" "}
                      <div>• Slack Notifications</div>{" "}
                      <div>• Basic Analytics</div>
                    </div>
                  ) : subscriptionDetails?.attributes?.product_name ===
                    "Starter" ? (
                    <div>
                      <div>• 20 Instant Reddit Feed Refreshes/month</div>{" "}
                      <div>• Add 5 Twitter Accounts</div>
                      <div>• 30 mins Twitter Autorefresh</div>{" "}
                      <div>• Slack Notifications</div>{" "}
                      <div>• Basic Analytics</div>
                    </div>
                  ) : subscriptionDetails?.attributes?.product_name ===
                    "Growth" ? (
                    <div>
                      <div>• 50 Instant Reddit Feed Refreshes/month</div>
                      <div>• Add 7 Twitter Accounts</div>
                      <div>• 15 mins Twitter Autorefresh</div>
                      <div>• Slack Notifications</div>
                      <div>• Advanced Analytics</div>
                      <div>• Priority Support</div>
                    </div>
                  ) : subscriptionDetails?.attributes?.product_name ===
                    "Scale" ? (
                    <div>
                      <div>• 80 Instant Reddit Feed Refreshes</div>
                      <div>• Add 15 Twitter Accounts</div>
                      <div>• 15 mins Twitter Autorefresh</div>
                      <div>• Slack Notifications</div>
                      <div>• Telegram, WhatsApp Notifications</div>
                      <div>• Comprehensive Analytics</div>
                    </div>
                  ) : (
                    <div>
                      <div>• 10 Instant Reddit Feed Refreshes/month</div>{" "}
                      <div>• Add 3 Twitter Accounts</div>
                      <div>• 30 mins Twitter Autorefresh</div>{" "}
                      <div>• Slack Notifications</div>{" "}
                      <div>• Basic Analytics</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:flex">
              <div className="max-h-screen overflow-hidden">
                <div className="items-center justify-center md:h-auto min-w-[50vw] relative w-full">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9] flex justify-center w-full font-kumbh-sans-bold text-3xl">
                    TopFeed is Worldwide!
                  </div>
                  <div className="max-w-7xl mx-auto w-full relative overflow-hidden md:h-[30rem]">
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 1,
                      }}
                      className="div"
                    ></motion.div>
                    <div className="absolute w-full bottom-0 inset-x-0 h-32 bg-gradient-to-b pointer-events-none select-none from-transparent  to-[#0b0b0b] z-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscription;
/*
<div className="absolute w-full -bottom-0 h-72 md:h-full z-10">
                      <World data={sampleArcs} globeConfig={globeConfig} />
                    </div>
                     */
