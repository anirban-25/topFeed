import { useState } from 'react'
import { Switch } from '@headlessui/react'
import TelegramLoginButton from './TelegramLoginButton'

const ServiceBlock = ({
  icon,
  title,
  connected,
  accountName,
  onConnect,
  onAddBot,
  onDisconnect,
  onDeactivate,
}) => {
  const [showTelegramLogin, setShowTelegramLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [redditConnected, setRedditConnected] = useState(false);

  const handleTelegramConnect = () => {
    setShowTelegramLogin(true)
  }
  const toggleTwitterConnection = () => {
    setTwitterConnected(!twitterConnected);
    // Store twitter connection status in Firestore
  };

  const toggleRedditConnection = () => {
    setRedditConnected(!redditConnected);
    // Store reddit connection status in Firestore
  };

  const handleSettingsClick = () => {
    setShowSettings(prev => !prev)
  }

  const handleDisconnect = () => {
    onDisconnect()
    setShowSettings(false)
  }

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
      <div className="flex items-center space-x-4">
        {connected ? (
          <>
            <Switch
              checked={connected}
              onChange={onDeactivate}
              className={`${connected ? 'bg-blue-600' : 'bg-gray-200'}
                relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${connected ? 'translate-x-6' : 'translate-x-1'}
                  inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
            <button
              onClick={handleSettingsClick}
              className="text-gray-600 hover:text-gray-900"
            >
              <img src="/images/settings.svg" alt="settings" className="h-7 w-7" />
            </button>
            {showSettings && (
              <div className="absolute bg-white border rounded-lg shadow-lg p-4 mt-2 w-48">
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
                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                + Connect
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ServiceBlock
