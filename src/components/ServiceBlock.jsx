import { useEffect, useState, useRef } from "react";
import { Switch } from "@headlessui/react";
import TelegramLoginButton from "./TelegramLoginButton";
import NotificationDialog from "@/components/NotificationDialog";

const ServiceBlock = ({
  icon,
  title,
  connected,
  accountName,
  onConnect,
  onDisconnect,
  isActive,
  onToggleSwitch,
  twitterConnected,
  redditConnected,
  handleToggleTwitter,
  handleToggleReddit,
}) => {
  const [showTelegramLogin, setShowTelegramLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const settingsRef = useRef(null);
  const [size, setSize] = useState(null);

  const handleOpen = (value) => setSize(value);

  const handleConnect = () => {
    if (title === "Telegram") {
      setShowTelegramLogin(true);
    } else {
      onConnect();
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
    handleOpen(null);
    setShowSettings(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm flex items-center justify-between w-full mb-4">
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h4 className="font-semibold text-lg">{title}</h4>
          {connected ? (
            <p className="text-gray-700">{accountName}</p>
          ) : (
            <p className="text-gray-500"></p>
          )}
        </div>
      </div>
      <div className="relative flex items-center space-x-4">
        {connected ? (
          <>
            <Switch
              checked={isActive}
              onChange={onToggleSwitch}
              className={`${
                isActive ? "bg-blue-500" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  isActive ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
            <button
              onClick={() => handleOpen("md")}
              className="text-gray-600 hover:text-gray-900"
            >
              <img
                src="/images/settings.svg"
                alt="settings"
                className="h-7 w-7 hover:rotate-90 duration-200 hover:scale-105"
              />
            </button>
          </>
        ) : (
          <>
            {showTelegramLogin && title === "Telegram" ? (
              <TelegramLoginButton onAuth={onConnect} />
            ) : (
              <button
                onClick={handleConnect}
                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                + Connect
              </button>
            )}
          </>
        )}
      </div>
      <NotificationDialog size={size} handleOpen={handleOpen} handleDisconnect={handleDisconnect} />
    </div>
  );
};

export default ServiceBlock;
