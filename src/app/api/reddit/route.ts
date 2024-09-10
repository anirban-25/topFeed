import { NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { storeDataInFirestore } from "@/utils/storeRedditData";

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
    const { subreddits, userId, isRefresh } = await req.json();  // Accept isRefresh flag
    console.log("Subreddits:", subreddits);
    console.log("User ID:", userId);
    console.log("Is Refresh:", isRefresh);
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

      // Store the processed data, subreddits, and increment the refresh count in Firestore
      await storeDataInFirestore(analysisData, userId, subreddits);  // Pass isRefresh flag

      return NextResponse.json({ message: "Data processed and stored successfully", analysisData }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to invoke Lambda function" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}