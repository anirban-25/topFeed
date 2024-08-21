"use client";
import { useState } from "react"
import { FaEnvelope } from "react-icons/fa"
import TelegramLoginButton from './TelegramLoginButton'
import { Switch } from '@headlessui/react' 
import ServiceBlock from './ServiceBlock'

const BotsAndAlerts = () => {
  const [telegramConnected, setTelegramConnected] = useState(false)
  const [telegramAccoWunt, setTelegramAccount] = useState("")
  //const [emailConnected, setEmailConnected] = useState(false)
  //const [emailAccount, setEmailAccount] = useState("")

  const handleTelegramAuth = (user) => {
    if (user) {
      setTelegramConnected(true)
      setTelegramAccount(`@${user.username}`)
      console.log("Telegram connected:", user)
    } else {
      console.error("Telegram login failed")
    }
  }

  const handleAddTelegramBot = () => {
    console.log("Telegram bot added for", telegramAccount)
  }

  const handleDisconnectTelegram = () => {
    setTelegramConnected(false)
    setTelegramAccount("")
    console.log("Telegram bot disconnected")
  }

  return (
    <div className="py-4"> 
      <div className="container px-6 space-y-4">
        <div className="flex flex-col items-center">
          <ServiceBlock
            icon={<img src="/images/telegram.svg" alt="Telegram" className="h-10 w-10" />}
            title="Telegram"
            connected={telegramConnected}
            accountName={telegramAccount}
            onConnect={handleTelegramAuth}
            onAddBot={handleAddTelegramBot}
            onDisconnect={handleDisconnectTelegram}
          />
        </div>
      </div>
    </div>
  )
}

export default BotsAndAlerts
