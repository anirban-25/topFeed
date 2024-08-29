import { useState } from 'react';
import TelegramLoginButton from './TelegramLoginButton';

const ServiceBlock = ({
  icon,
  title,
  connected,
  accountName,
  onConnect,
  onDisconnect,
  twitterConnected,
  redditConnected,
  setTwitterConnected,
  setRedditConnected
}) => {
  const [showTelegramLogin, setShowTelegramLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleTelegramConnect = () => setShowTelegramLogin(true);

  const toggleTwitterConnection = () => {
    const newStatus = !twitterConnected;
    setTwitterConnected(newStatus);
  };

  const toggleRedditConnection = () => {
    const newStatus = !redditConnected;
    setRedditConnected(newStatus);
  };

  const handleSettingsClick = () => setShowSettings(prev => !prev);

  const handleDisconnect = () => {
    onDisconnect();
    setShowSettings(false);
  };

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
            <button
              onClick={handleSettingsClick}
              className="text-gray-600 hover:text-gray-900"
            >
              <img src="/images/settings.svg" alt="settings" className="h-7 w-7" />
            </button>
            {showSettings && (
              <div className="settings-popup">
                <button
                  onClick={handleDisconnect}
                  className="w-full text-red-600 hover:text-red-800"
                >
                  Disconnect
                </button>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={twitterConnected}
                      onChange={toggleTwitterConnection}
                    />
                    <span className="ml-2">Twitter</span>
                  </label>
                  <label className="inline-flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={redditConnected}
                      onChange={toggleRedditConnection}
                    />
                    <span className="ml-2">Reddit</span>
                  </label>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {showTelegramLogin ? (
              <TelegramLoginButton onAuth={onConnect} />
            ) : (
              <button
                onClick={handleTelegramConnect}
                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                + Connect
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceBlock;
