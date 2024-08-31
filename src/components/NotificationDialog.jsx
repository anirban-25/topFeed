import { useState, useEffect, createElement } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaXTwitter, FaRedditAlien } from "react-icons/fa6";

const SocialMediaDialog = ({ size, handleOpen, handleDisconnect }) => {
  const [twitterAccounts, setTwitterAccounts] = useState([]);
  const [selectedTwitterAccounts, setSelectedTwitterAccounts] = useState([]);
  const [redditAccounts, setRedditAccounts] = useState([]);
  const [
    previouslySelectedTwitterAccounts,
    setPreviouslySelectedTwitterAccounts,
  ] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchTwitterAccounts = async () => {
      if (user) {
        // Fetch user's tweet feed data
        const tweetFeedRef = collection(db, "users", user.uid, "tweet_feed");
        const tweetQuerySnapshot = await getDocs(tweetFeedRef);

        const accounts = [];
        tweetQuerySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.twitterUrls) {
            accounts.push(
              ...data.twitterUrls.map((url) => {
                const handle = url.replace("https://x.com/", "");
                return {
                  url,
                  handle,
                  profileImageUrl: `https://unavatar.io/twitter/${handle}`,
                };
              })
            );
          }
        });
        setTwitterAccounts(accounts);

        // Fetch selected twitter accounts from notifications collection
        const notificationsRef = doc(db, "notifications", user.uid);
        const notificationsSnap = await getDoc(notificationsRef);

        if (notificationsSnap.exists()) {
          const existingTwitterAccounts =
            notificationsSnap.data().twitterAccounts || [];
          setSelectedTwitterAccounts(existingTwitterAccounts);
          setPreviouslySelectedTwitterAccounts(existingTwitterAccounts);
        }
      }
    };
    const fetchRedditAccounts = async () => {
      if (user) {
        const latestAnalysisRef = doc(
          db,
          "users",
          user.uid,
          "user_reddits",
          "latest_analysis"
        );
        const latestAnalysisSnap = await getDoc(latestAnalysisRef);

        if (latestAnalysisSnap.exists()) {
          const data = latestAnalysisSnap.data();
          if (data.subreddits) {
            const subreddits = data.subreddits.map((subreddit) => ({
              name: subreddit,
              url: `https://www.reddit.com/r/${subreddit}`,
              profileImageUrl: `https://unavatar.io/reddit/${subreddit}`,
            }));
            setRedditAccounts(subreddits);
          }
        }
      }
    };

    fetchTwitterAccounts();
    fetchRedditAccounts();
  }, [user]);

  const handleConfirm = async () => {
    if (user) {
      try {
        const notificationsRef = doc(db, "notifications", user.uid);

        // Calculate accounts to add and remove
        const accountsToAdd = selectedTwitterAccounts.filter(
          (handle) => !previouslySelectedTwitterAccounts.includes(handle)
        );
        if (selectedTwitterAccounts.length === 0) {
        }

        console.log("Accounts to Add:", accountsToAdd);

        // Update Firestore
        await updateDoc(notificationsRef, {
          twitterAccounts: accountsToAdd,
        });

        console.log("Firestore updated successfully");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
    handleOpen(null); // Close the dialog
  };

  const handleSelectAll = () => {
    setSelectedTwitterAccounts(
      twitterAccounts.map((account) => account.handle)
    );
  };

  const handleUnselectAll = () => {
    setSelectedTwitterAccounts([]);
  };

  const handleAccountToggle = (handle) => {
    setSelectedTwitterAccounts((prevSelected) =>
      prevSelected.includes(handle)
        ? prevSelected.filter((item) => item !== handle)
        : [...prevSelected, handle]
    );
  };

  const data = [
    {
      label: "Twitter",
      value: "twitter",
      icon: FaXTwitter,
      content: (
        <div>
          <div className="flex justify-between mt-5">
            <h3 className="text-lg font-kumbh-sans-regular mb-2">
              Twitter Accounts:
            </h3>
            <div className="flex space-x-2 mb-2">
              <Button variant="text" color="gray" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="text" color="gray" className="" onClick={handleUnselectAll}>
                Unselect All
              </Button>
            </div>
          </div>
          <ul className="space-y-2">
            {twitterAccounts.map((account, index) => (
              <li key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTwitterAccounts.includes(account.handle)}
                  onChange={() => handleAccountToggle(account.handle)}
                />
                <Image
                  src={account.profileImageUrl}
                  alt={`${account.handle} profile`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <a
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-kumbh-sans-medium"
                >
                  @{account.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      label: "Reddit",
      value: "reddit",
      icon: FaRedditAlien,
      content: (
        <div>
          <h3 className="text-lg font-kumbh-sans-regular mb-2">Subreddits:</h3>
          <ul className="space-y-2">
            {redditAccounts.map((subreddit, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Image
                  src={subreddit.profileImageUrl}
                  alt={`${subreddit.name} profile`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <a
                  href={subreddit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-kumbh-sans-medium"
                >
                  r/{subreddit.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ), // Placeholder for the Reddit content
    },
  ];

  return (
    <Dialog
      open={["xs", "sm", "md", "lg", "xl", "xxl"].includes(size)}
      size={size || "md"}
      handler={handleOpen}
      className="max-h-[80%] overflow-scroll"
    >
      <DialogHeader className="font-kumbh-sans-bold flex justify-between">
        <div>Notification Settings</div>
        <div
          className="text-sm font-kumbh-sans-light p-2 hover:bg-red-100/40  drop-shadow-2xl duration-200 cursor-pointer text-red-500 rounded-lg"
          onClick={() => handleDisconnect()}
        >
          Disconnect Telegram
        </div>
      </DialogHeader>
      <DialogBody>
        <Tabs defaultValue="twitter" value="twitter" className="w-full">
          <TabsHeader
            className="bg-transparent"
            indicatorProps={{
              className: "bg-gray-900/20 shadow-none !text-gray-900",
            }}
          >
            {data.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2 py-1 font-kumbh-sans-bold">
                  {createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, content }) => (
              <TabPanel key={value} value={value} className="py-4">
                {content}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => handleOpen(null)}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleConfirm}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SocialMediaDialog;
