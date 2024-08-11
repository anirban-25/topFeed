import { useState } from "react"
import { FaEnvelope } from "react-icons/fa"
import TelegramLoginButton from './TelegramLoginButton'
import { Switch } from '@headlessui/react' 

const ServiceBlock = ({ icon, title, connected, accountName, onConnect, onAddBot, onDisconnect, onDeactivate }) => {
  const [showTelegramLogin, setShowTelegramLogin] = useState(false)

  const handleTelegramConnect = () => {
    setShowTelegramLogin(true)
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
            <button onClick={onAddBot} className="text-gray-600 hover:text-gray-900">
              <img src="/images/settings.svg" alt="settings" className="h-7 w-7" />
            </button>
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
