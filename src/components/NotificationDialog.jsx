import { useState, useEffect, createElement, useRef } from "react";
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
import { IoIosArrowDropdown, IoIosCloseCircle } from "react-icons/io";
import { FaTelegram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { db, app } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SocialMediaDialog = ({ size, handleOpen, handleDisconnect }) => {
  const [selectedNotificationLevels, setSelectedNotificationLevels] = useState(
    []
  );
  const [existingData, setExistingData] = useState(null);
  const [telegramAccountName, setTelegramAccountName] = useState("");
  // const [alertPreference, setAlertPreference] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [currentView, setCurrentView] = useState("main");
  const [groups, setGroups] = useState([]);
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  const [isOnlyMeSelected, setIsOnlyMeSelected] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [sendTo, setSendTo] = useState(false);
  const [existingGroupName, setExistingGroupName] = useState("");
  const [copied, setCopied] = useState(false);
  const auth = getAuth(app);
  const hasFetched = useRef(false);

  const handleDeleteGroup = async (groupId) => {
    if (user) {
      try {
        const notificationsRef = doc(db, "notifications", user.uid);
        const docSnap = await getDoc(notificationsRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const existingGroups = existingData.groups || [];

          const updatedGroups = existingGroups.filter(
            (group) => group.id !== groupId
          );

          await updateDoc(notificationsRef, {
            ...existingData,
            groups: updatedGroups,
          });

          setExistingData((prevData) => ({
            ...prevData,
            groups: updatedGroups,
          }));

          // Update group selection state if all groups are removed
          if (updatedGroups.length === 0) {
            setIsGroupSelected(false);
            setShowGroupDropdown(false);
          }
        }
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("@TopFeedAI_bot");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  //   const handleSubmit = async () => {
  //   if (user) {
  //     try {
  //       const notificationsRef = doc(db, "notifications", user.uid);
  //       const docSnap = await getDoc(notificationsRef);
  //       const selectedGroup = groups.find(
  //         (group) => group.id.toString() === selectedGroupId.toString()
  //       );

  //       if (!selectedGroup) {
  //         console.error("Selected group not found");
  //         // return;
  //       }

  //       const existingData = docSnap.exists() ? docSnap.data() : {};
  //       const existingGroups = existingData.groups || [];
  //       const groupExists = existingGroups.some(
  //         (group) => group.id === selectedGroup.id
  //       );

  //       if (!groupExists) {
  //         const updatedGroups = [
  //           ...existingGroups,
  //           {
  //             id: selectedGroup.id,
  //             name: selectedGroup.name,
  //           },
  //         ];

  //         const updatedData = {
  //           ...existingData,
  //           groups: updatedGroups,
  //           notificationLevels: selectedNotificationLevels,
  //           sendTo: sendTo,
  //         };

  //         // Update Firestore
  //         await updateDoc(notificationsRef, updatedData);

  //         // Update local state immediately
  //         setExistingData(updatedData);

  //         console.log("Notification settings updated successfully");
  //       } else {
  //         console.log("Group already exists, skipping addition");
  //       }
  //     } catch (error) {
  //       console.error("Error updating notification settings:", error);
  //     }
  //   }
  //   handleOpen(null);
  // };

  const handleSubmit = async () => {
    if (user) {
      try {
        const notificationsRef = doc(db, "notifications", user.uid);
        const docSnap = await getDoc(notificationsRef);
        const selectedGroup = groups.find(
          (group) => group.id.toString() === selectedGroupId.toString()
        );

        const existingData = docSnap.exists() ? docSnap.data() : {};
        const existingGroups = existingData.groups || [];
        const groupExists = existingGroups.some(
          (group) => group.id === selectedGroup?.id
        );

        try {
          if (selectedGroup && !groupExists) {
            const updatedGroups = [
              ...existingGroups,
              {
                id: selectedGroup.id,
                name: selectedGroup.name,
              },
            ];

            const updatedData = {
              ...existingData,
              groups: updatedGroups,
              notificationLevels: selectedNotificationLevels,
              sendTo,
            };

            await updateDoc(notificationsRef, updatedData);
            setExistingData(updatedData);
          } else {
            const updateOthers = {
              ...existingData,

              notificationLevels: selectedNotificationLevels,
              sendTo,
            };
            await updateDoc(notificationsRef, updateOthers);
            setExistingData(updatedData);
          }
        } catch (error) {}
      } catch (error) {
        console.error("Error updating notification settings:", error);
      }
    }
    handleOpen(null);
  };

  const fetchGroups = async (telegramUserId) => {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/getUpdates`
      );

      const telegramData = await response.json();

      if (!telegramData.ok) {
        console.error("error from telegram API:", telegramData);
        return [];
      }

      const updates = telegramData.result.filter(
        (update) =>
          update.my_chat_member &&
          update.my_chat_member.from &&
          update.my_chat_member.from.id === telegramUserId
      );

      const groupStatusMap = updates.reduce((result, update) => {
        const chatId = update.my_chat_member.chat.id;
        const chatTitle = update.my_chat_member.chat.title;
        const chatStatus = update.my_chat_member.new_chat_member.status;

        if (!result[chatId]) {
          result[chatId] = { id: chatId, name: chatTitle, status: chatStatus };
        } else {
          if (chatStatus === "left") {
            result[chatId].status = "left";
          }
        }

        return result;
      }, {});

      const filteredGroups = Object.values(groupStatusMap).filter(
        (group) => group.status === "member"
      );

      if (filteredGroups.length > 0) {
        setGroups(filteredGroups);
        setIsGroupSelected(true);
      }

      return filteredGroups;
    } catch (error) {
      console.error("Error fetching Telegram groups:", error);
      return [];
    }
  };

  const fetchNotificationSettings = async (userId) => {
    try {
      const notificationsDoc = doc(db, "notifications", userId);
      const docSnap = await getDoc(notificationsDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setExistingData(data);
        setSelectedNotificationLevels(data.notificationLevels || []);
        setSendTo(data.sendTo || false);
        setIsOnlyMeSelected(data.sendTo || false);

        if (data?.groups?.length > 0) {
          setIsGroupSelected(true);
          setShowGroupDropdown(true);
        }
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !hasFetched.current) {
        hasFetched.current = true;
        setUser(user);

        try {
          const notificationsDoc = doc(db, "notifications", user.uid);
          const docSnap = await getDoc(notificationsDoc);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const telegramUserId = data?.telegramUserId;
            setSendTo(data?.sendTo || false);
            setIsOnlyMeSelected(data?.sendTo || false);
            setExistingGroupName(data?.group_name || "");
            setExistingData(data);
            setTelegramAccountName(data?.telegramAccount || "");

            if (data?.groups?.length > 0) {
              setIsGroupSelected(true);
              setShowGroupDropdown(true);
            }

            if (telegramUserId) {
              setLoadingGroups(true);
              const fetchedGroups = await fetchGroups(telegramUserId);
              setGroups(fetchedGroups);
              setLoadingGroups(false);
            }
          }
        } catch (error) {
          console.error("Error fetching Telegram User ID:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user?.uid) {
      fetchNotificationSettings(user.uid);
    }
  }, [user]);

  const handleNotificationLevelChange = (level) => {
    setSelectedNotificationLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    console.log(selectedNotificationLevels);
  };

  const handlePreferenceChange = (pref) => {
    if (pref === "group") {
      setIsGroupSelected(!isGroupSelected);
      setShowGroupDropdown(!showGroupDropdown);
    } else if (pref === "onlyme") {
      setIsOnlyMeSelected(!isOnlyMeSelected);
      setSendTo(!sendTo);
    }
  };

  const mainView = (
    <>
      <DialogHeader className="flex overflow-y-scroll justify-between items-center">
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
            {[
              {
                label: "Twitter",
                value: "twitter",
                icon: FaXTwitter,
              },
            ].map(({ label, value, icon }) => (
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
                        <label
                          htmlFor={level}
                          className="capitalize text-gray-700"
                        >
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
                          checked={isGroupSelected}
                          onChange={() => handlePreferenceChange("group")}
                          className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="group"
                          className="text-gray-700 cursor-pointer"
                        >
                          Group
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="onlyme"
                          checked={isOnlyMeSelected}
                          onChange={() => handlePreferenceChange("onlyme")}
                          className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="onlyme"
                          className="text-gray-700 cursor-pointer"
                        >
                          Only Me
                        </label>
                      </div>
                    </div>
                    {telegramAccountName && (
                      <div className="mb-4   items-center ">
                        <h4 className="text-sm font-kumbh-sans-medium mb-2 text-gray-700 ">
                          Connected Account
                        </h4>
                        <div className="p-2 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-2">
                            <FaTelegram className="text-blue-500 text-xl md:text-2xl" />
                            <span className="text-sm text-gray-800">
                              @{telegramAccountName}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Connected Groups Display */}
                    {existingData?.groups?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Connected Groups
                        </h4>
                        <div className="space-y-2">
                          {existingData?.groups?.map((group) => (
                            <div
                              key={group.id}
                              className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200"
                            >
                              <span className="text-sm text-gray-800">
                                {group.name}
                              </span>
                              <Button
                                variant="text"
                                color="red"
                                size="sm"
                                className="p-2"
                                onClick={() => handleDeleteGroup(group.id)}
                              >
                                <IoIosCloseCircle className="w-5 h-5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                                } else {
                                  setSelectedGroupId(e.target.value);
                                }
                              }}
                              value={selectedGroupId}
                            >
                              <option value="">Select a group</option>
                              {groups.map((group) => {
                                const isSelected =
                                  group.name === existingGroupName;
                                // If this group matches the existing group_name, pre-select it
                                if (isSelected && !selectedGroupId) {
                                  setSelectedGroupId(group.id.toString());
                                }
                                return (
                                  <option
                                    key={group.id}
                                    value={group.id}
                                    className={
                                      isSelected
                                        ? "font-bold text-blue-600"
                                        : ""
                                    }
                                    style={
                                      isSelected
                                        ? { backgroundColor: "#EBF8FF" }
                                        : {}
                                    }
                                  >
                                    {group.name} {isSelected ? "(Current)" : ""}
                                  </option>
                                );
                              })}
                              <option
                                value="addBot"
                                className="text-blue-600 font-medium"
                              >
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
        <Button variant="gradient" color="blue" onClick={handleSubmit}>
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
          <IoIosCloseCircle className="text-2xl text-gray-700" />
        </Button>
      </DialogHeader>
      <div className="overflow-y-auto max-h-[70vh] px-4">
        <DialogBody divider className="space-y-6">
          <Typography className="text-gray-700">
            Please follow the steps below to add the TopFeed bot to your
            Telegram Group:
          </Typography>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                1
              </div>
              <div>
                <Typography className="font-medium mb-2">
                  Open the group you wish to add the TopFeed bot.
                </Typography>
                <Card className="bg-gray-50 max-w-sm">
                  <CardBody className="p-2">
                    <img
                      src="/images/tel1.jpg"
                      alt="Step 1"
                      className="rounded-lg"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                2
              </div>
              <div>
                <Typography className="font-medium mb-2">
                  Edit the group and go to add new members.
                </Typography>
                <Card className="w-full bg-gray-50 max-w-sm">
                  <CardBody className="p-2">
                    <img
                      src="/images/tel5.jpg"
                      alt="Step 2"
                      className="rounded-lg"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                3
              </div>
              <div>
                <Typography className="font-medium mb-2">
                  In the search bar, find the bot with the username
                  <div className="flex text-gray-800 font-mono text-sm">
                    <button
                      className={`px-3 py-2 items-center border rounded-md 
                        ${
                          copied
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-300 text-blue-500 hover:text-blue-700"
                        }`}
                      onClick={handleCopy}
                    >
                      <span className="inline-flex items-center gap-2">
                        <HiMiniClipboardDocumentList />
                        {copied ? "Copied to Clipboard!" : "@TopFeedAI_bot"}
                      </span>
                    </button>
                  </div>
                </Typography>
                <Card className="w-full bg-gray-50 max-w-sm">
                  <CardBody className="p-2">
                    <img
                      src="/images/tel6.jpg"
                      alt="Step 3"
                      className="rounded-lg"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </DialogBody>
      </div>
      <DialogFooter className="flex justify-end">
        <button
          variant="gradient"
          className="bg-blue-400 px-3 py-1 rounded-md text-white font-kumbh-sans-medium"
          onClick={async () => {
            if (user && existingData?.telegramUserId) {
              setLoadingGroups(true);
              const fetchedGroups = await fetchGroups(
                existingData.telegramUserId
              );
              setGroups(fetchedGroups);
              setLoadingGroups(false);
            }
            setCurrentView("main");
          }}
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
      className="bg-white/90  max-h-[90vh] overflow-scroll flex flex-col backdrop-blur-sm"
    >
      {currentView === "main" ? mainView : telegramView}
    </Dialog>
  );
};

export default SocialMediaDialog;
