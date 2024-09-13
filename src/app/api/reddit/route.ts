import { NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { storeDataInFirestore } from "@/utils/storeRedditData";
import { getUserNotificationSettings, sendTelegramMessage } from "@/utils/notificationUtils"; 

// Initialize AWS SDK Lambda client
const lambdaClient = new LambdaClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { subreddits, userId} = await req.json();

    // Log the incoming request data
    console.log("Subreddits:", subreddits);
    console.log("User ID:", userId);
    //console.log("Is Refresh:", isRefresh);
    console.log("-------------------------------------------");

    const eventPayload = {
      body: JSON.stringify({ subreddits }),
    };

    const params = {
      FunctionName: "chatgpt",
      Payload: JSON.stringify(eventPayload),
    };

    const command = new InvokeCommand(params);
    const lambdaResponse = await lambdaClient.send(command);
    console.log("Lambda response:", lambdaResponse);

    if (lambdaResponse.StatusCode === 200 && lambdaResponse.Payload) {
      const parsedResponse = JSON.parse(Buffer.from(lambdaResponse.Payload).toString());

      if (parsedResponse.statusCode === 400) {
        return NextResponse.json({ error: parsedResponse.body }, { status: 400 });
      }

      const parsedBody = JSON.parse(parsedResponse.body);
      const analysisData = parsedBody;

      console.log("Analysis data to store in Firestore:", analysisData);

      if (!analysisData) {
        throw new Error("No analysis data found in the Lambda response.");
      }
      // await sendTelegramMessage('Atishab', 'Test message from bot');

      // Store the processed data, subreddits, and increment the refresh count in Firestore
      await storeDataInFirestore(analysisData, userId, subreddits);
      console.log("Fetching user notification settings for:", userId);

      // Fetch user notification settings from Firestore
      const userSettings = await getUserNotificationSettings(userId);
      console.log("Fetched User Settings:", userSettings);

      // Check if userSettings exist and match the criteria to send a Telegram notification
      if (userSettings && userSettings.istelegram == true && userSettings.isActive == true && userSettings.reddit == true) {
        console.log("conditions matched lessgo");
        const message = `New Reddit analysis data available: ${JSON.stringify(analysisData)}`;
        // Send the message to the user's Telegram account
        await sendTelegramMessage(userSettings.telegramUserId, message);
        console.log("Telegram message sent successfully.");
      }

      return NextResponse.json({ message: "Data processed, stored, and notification sent if applicable", analysisData }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to invoke Lambda function" }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}