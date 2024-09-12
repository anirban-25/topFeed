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
    const { subreddits, userId } = await req.json();

    // Immediately return a response indicating that the request is being processed
    return NextResponse.json({ message: "Request received, processing in the background" }, { status: 202 });

    // Proceed with processing the data in the background asynchronously
    setTimeout(async () => {
      // Event payload for Lambda
      const eventPayload = {
        body: JSON.stringify({ subreddits }),
      };

      const params = {
        FunctionName: "chatgpt",
        Payload: JSON.stringify(eventPayload),
      };

      const command = new InvokeCommand(params);
      const lambdaResponse = await lambdaClient.send(command);

      if (lambdaResponse.StatusCode === 200 && lambdaResponse.Payload) {
        const parsedResponse = JSON.parse(Buffer.from(lambdaResponse.Payload).toString());
        const parsedBody = JSON.parse(parsedResponse.body);
        const analysisData = parsedBody;

        if (!analysisData) throw new Error("No analysis data found in the Lambda response.");

        // Store data in Firestore and send notifications
        await storeDataInFirestore(analysisData, userId, subreddits);

        const userSettings = await getUserNotificationSettings(userId);
        if (userSettings && userSettings.istelegram && userSettings.isActive && userSettings.reddit) {
          const message = `New Reddit analysis data available: ${JSON.stringify(analysisData)}`;
          await sendTelegramMessage(userSettings.telegramUserId, message);
        }
      } else {
        console.error("Failed to invoke Lambda function");
      }
    }, 0); // Use a short timeout to let the API return first, and then run this in the background

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
