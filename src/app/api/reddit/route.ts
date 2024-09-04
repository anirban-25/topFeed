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

// Define the types for the parameters
interface ProcessRedditDataParams {
  subreddits: string[];  // assuming subreddits is an array of strings
  userId: string;        // assuming userId is a string
}

// Asynchronous function to handle processing
async function processRedditData({ subreddits, userId }: ProcessRedditDataParams): Promise<void> {
  try {
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
        throw new Error(parsedResponse.body);
      }

      const parsedBody = JSON.parse(parsedResponse.body);
      const analysisData = parsedBody;

      console.log("Analysis data to store in Firestore:", analysisData);

      if (!analysisData) {
        throw new Error("No analysis data found in the Lambda response.");
      }

      // Store the processed data in Firestore
      await storeDataInFirestore(analysisData, userId, subreddits);

      // Fetch user notification settings from Firestore
      const userSettings = await getUserNotificationSettings(userId);
      console.log("Fetched User Settings:", userSettings);

      // Send Telegram notification if applicable
      if (userSettings && userSettings.istelegram && userSettings.isActive && userSettings.reddit) {
        const message = `New Reddit analysis data available: ${JSON.stringify(analysisData)}`;
        await sendTelegramMessage(userSettings.telegramUserId, message);
        console.log("Telegram message sent successfully.");
      }
    } else {
      console.error("Failed to invoke Lambda function");
    }
  } catch (error) {
    console.error("Error in processing Reddit data:", error);
  }
}

export async function POST(req: Request) {
  try {
    // Define the expected structure of the request body
    const { subreddits, userId }: { subreddits: string[], userId: string } = await req.json();

    // Log the incoming request data
    console.log("Subreddits:", subreddits);
    console.log("User ID:", userId);

    // Immediately return a 202 Accepted response to indicate the request has been received
    const response = NextResponse.json({ message: "Request received and is being processed" }, { status: 202 });

    // Asynchronously process the Reddit data in the background
    processRedditData({ subreddits, userId });

    return response;
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
