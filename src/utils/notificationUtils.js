import { db } from "@/firebase"; // Firestore initialization
import { doc, getDoc } from "firebase/firestore";
import axios from "axios"; // Used for sending HTTP requests to Telegram API

// Function to get user notification settings
export async function getUserNotificationSettings(userId) {
  try {
    console.log("Trying to fetch user settings for userId:", userId);
    const notificationDocRef = doc(db, 'notifications', userId);
    const docSnap = await getDoc(notificationDocRef);
    if (docSnap.exists()) {
        console.log("Document found:", docSnap.data());
      return docSnap.data();
    } else {
      console.error("No notification settings found for user:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user notification settings:", error);
    return null;
  }
}

// Function to send a message to the user's Telegram account
export async function sendTelegramMessage(telegramAccount, message) {
  try {
    console.log("Sending message to Telegram account:", telegramAccount);
    const telegramToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN; // Your bot token     
    const telegramChatId = telegramAccount; // Assuming this is the chat ID or username
    
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: telegramChatId,
      text: message,
    });

    console.log("Telegram message sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    throw new Error("Failed to send Telegram message");
  }
}
