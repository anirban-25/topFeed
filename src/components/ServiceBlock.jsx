import { useEffect, useState, useRef} from 'react';
import { Switch } from '@headlessui/react';
import TelegramLoginButton from './TelegramLoginButton';

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

  const handleTelegramConnect = () => setShowTelegramLogin(true);

  

  const handleSettingsClick = () => setShowSettings(prev => !prev);

  const handleDisconnect = () => {
    onDisconnect();
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
                isActive ? 'bg-blue-500' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
            <button
              onClick={handleSettingsClick}
              className="text-gray-600 hover:text-gray-900"
            >
              <img src="/images/settings.svg" alt="settings" className="h-7 w-7 hover:bg-gray-200" />
            </button>
            {showSettings && (
              <div
              ref={settingsRef}
              className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10"
              style={{ width: '200px' }}
            >
              
              <div className="mt-2">
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={twitterConnected}
                    onChange={handleToggleTwitter}
                  />
                  <span className="ml-2">Twitter</span>
                </label>
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={redditConnected}
                    onChange={handleToggleReddit}
                  />
                  <span className="ml-2">Reddit</span>
                </label>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full text-red-300 hover:text-red-800"
              >
                Disconnect
              </button>
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
