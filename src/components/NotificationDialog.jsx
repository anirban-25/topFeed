import { useState, useEffect, createElement } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { IoIosArrowDropdown,IoIosCloseCircle } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { db, app} from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const SocialMediaDialog = ({ size, handleOpen, handleDisconnect }) => {
  const [selectedNotificationLevels, setSelectedNotificationLevels] = useState([]);
  const [alertPreference, setAlertPreference] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showTelegramConfig, setShowTelegramConfig] = useState(false);
  const [currentView, setCurrentView] = useState("main"); // "main" or "telegram"
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth(app);



  
  const fetchGroups = async (telegramUserId) => {
    try {
      console.log("fetching telegram updates...");
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/getUpdates`
      );
  
      const telegramData = await response.json();
      console.log("telegram API response:", telegramData);
  
      if (!telegramData.ok) {
        console.error("error from telegram API:", telegramData);
        return [];
      }
  
      const filteredGroups = telegramData.result
        .filter(
          (update) =>
            update.my_chat_member && 
            update.my_chat_member.from &&
            update.my_chat_member.from.id === telegramUserId 
        )
        .map((update) => ({
          id: update.my_chat_member.chat.id,
          name: update.my_chat_member.chat.title,
        }));
  
      if (filteredGroups.length === 0) {
        console.warn("No groups found for the Telegram user ID:", telegramUserId);
      }
  
      console.log("Fetched Groups:", filteredGroups);
      return filteredGroups;
    } catch (error) {
      console.error("Error fetching Telegram groups:", error);
      return [];
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
         
          const notificationsDoc = doc(db, "notifications", user.uid);
          const docSnap = await getDoc(notificationsDoc);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const telegramUserId = data?.telegramUserId;

            if (telegramUserId) {
              console.log("Telegram User ID:", telegramUserId);
              setLoadingGroups(true); 
              const fetchedGroups = await fetchGroups(telegramUserId);
              setGroups(fetchedGroups); 
              setLoadingGroups(false); 
            } else {
              console.warn("No Telegram User ID found for the user.");
            }
          } else {
            console.warn("No notifications document found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching Telegram User ID:", error);
        }
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe();
  }, [auth]);

  

  useEffect(() => {
    const loadGroups = async () => {
      if (user) {
        try {
          const fetchedGroups = await fetchGroups(user);
          if (fetchedGroups.length > 0) {
            setGroups(fetchedGroups);
            console.log("Groups State After Fetch:", fetchedGroups);
            
          }
        } catch (error) {
          console.error("Error in loadGroups:", error);
        }
      }
    };
  
    loadGroups();
  }, [user]);

  useEffect(() => {
    const loadGroups = async () => {
      const fetchedGroups = await fetchGroups();
      setGroups(fetchedGroups || []);
    };
    loadGroups();
  }, []);

  const handleNotificationLevelChange = (level) => {
    setSelectedNotificationLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleAlertPreferenceChange = (pref) => {
    setAlertPreference((prev) => {
      const newPrefs = prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref];
        
      // If group was just added, show telegram config
      if (pref === "group") {
        setShowGroupDropdown(!prev.includes("group")); 
      }
      return newPrefs;
    });
  };
  useEffect(() => {
    console.log("Groups State:", groups);
  }, [groups]);

  const mainView = (
    <>
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5" className="font-semibold">
          Notification Settings
        </Typography>
        <Button
          variant="text"
          color="red"
          size="sm"
          onClick={handleDisconnect}
          className="font-normal"
        >
          Disconnect Telegram
        </Button>
      </DialogHeader>
      <DialogBody className="!px-0">
        <Tabs value="twitter" className="w-full">
          <TabsHeader
            className="bg-transparent"
            indicatorProps={{
              className: "bg-blue-500/10 shadow-none !text-blue-500",
            }}
          >
            {[{
                label: "Twitter",
                value: "twitter",
                icon: FaXTwitter,
              }].map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2 py-1">
                  {createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody className="px-6">
            <TabPanel value="twitter">
              <div className="space-y-8">
                <div className="bg-white/40 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Select Notification Levels:
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:gap-6 space-y-4 sm:space-y-0">
                    {["high", "medium", "low"].map((level) => (
                      <div key={level} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={level}
                          checked={selectedNotificationLevels.includes(level)}
                          onChange={() => handleNotificationLevelChange(level)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor={level} className="capitalize text-gray-700">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Where do you want to get alerts?
                  </h3>
                  <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="group"
                      checked={alertPreference.includes("group")}
                      onChange={() => handleAlertPreferenceChange("group")}
                      className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="group" className="text-gray-700 cursor-pointer">
                      Group
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="onlyme"
                      checked={alertPreference.includes("onlyme")}
                      onChange={() => handleAlertPreferenceChange("onlyme")}
                      className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="onlyme" className="text-gray-700 cursor-pointer">
                      Only Me
                    </label>
                  </div>
                </div>
                {showGroupDropdown &&
                  (groups.length === 0 ? (
        
                    <Button
                      variant="gradient"
                      color="blue"
                      className="mt-4"
                      onClick={() => setCurrentView("telegram")}
                    >
                      Add Bot to Group
                    </Button>
                  ) : (
                    
                   
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full">
                      <label
                        htmlFor="selectGroup"
                        className="block mb-2 text-gray-700 text-sm"
                      >
                        Select a Group:
                      </label>
                      <div className="relative">
                        <select
                          id="selectGroup"
                          className="block w-full rounded-lg border-gray-300 p-2 appearance-none"
                          onChange={(e) => {
                            if (e.target.value === "addBot") {
                              setCurrentView("telegram");
                            }
                          }}
                        >
                          {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                          <option value="addBot" className="text-blue-600 font-medium">
                            + Add Bot to Group
                          </option>
                        </select>
                        <span className="absolute top-3 right-3 pointer-events-none text-gray-600 text-xl">
                          <IoIosArrowDropdown />
                        </span>
                      </div>
                    </div>
                  ))}


                  </div>
                </div>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </DialogBody>
      <DialogFooter className="border-t border-gray-200">
        <Button
          variant="text"
          color="gray"
          onClick={() => handleOpen(null)}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="blue"
          onClick={() => handleOpen(null)}
          disabled={alertPreference.length === 0}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </>
  );

  const telegramView = (
    <>
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5" className="font-semibold">
          Configure Telegram Group
        </Typography>
        <Button
          variant="text"
          color="gray"
          onClick={() => setCurrentView("main")}
        >
          <IoIosCloseCircle className="text-2xl text-gray-700"/>
        </Button>
      </DialogHeader>
      <DialogBody divider className="space-y-6">
        <Typography className="text-gray-700">
          Please follow the steps below to add Favtut bot to your Telegram Group
        </Typography>

        <div className="space-y-6">
        <div className="flex items-start gap-4">
            <div className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">1</div>
            <div>
              <Typography className="font-medium mb-2">Open the group you wish to add the Favtut bot</Typography>
              <Card className="w-full bg-gray-50">
                <CardBody className="p-2">
                  <img src="/api/placeholder/300/100" alt="Step 1" className="rounded-lg" />
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">2</div>
            <div>
              <Typography className="font-medium mb-2">Edit the group and go to add new members</Typography>
              <Card className="w-full bg-gray-50">
                <CardBody className="p-2">
                  <img src="/api/placeholder/300/100" alt="Step 2" className="rounded-lg" />
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">3</div>
            <div>
              <Typography className="font-medium mb-2">Search for @favtut_bot</Typography>
              <Card className="w-full bg-gray-50">
                <CardBody className="p-2">
                  <img src="/api/placeholder/300/100" alt="Step 3" className="rounded-lg" />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <button
          variant="gradient"
          className="bg-blue-400 px-3 py-1 rounded-md text-white font-kumbh-sans-medium"
          onClick={() => setCurrentView("main")}
        >
          Confirm and Verify
        </button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog
      open={["xs", "sm", "md", "lg", "xl", "xxl"].includes(size)}
      size={size || "md"}
      handler={handleOpen}
      className="bg-white/90 backdrop-blur-sm"
    >
      {currentView === "main" ? mainView : telegramView}
    </Dialog>
  );
};

export default SocialMediaDialog;