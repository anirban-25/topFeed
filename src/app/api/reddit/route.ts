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
    const { subreddits, userId } = await req.json();
    console.log("Subreddits:", subreddits);
    console.log("User ID:", userId);
    console.log("-------------------------------------------");

    // Create a stringified JSON object for the body
    const eventPayload = {
      body: JSON.stringify({ subreddits }),
    };

    // Prepare the Lambda invocation parameters
    const params = {
      FunctionName: "chatgpt", // Replace with your Lambda function name
      Payload: JSON.stringify(eventPayload), // Pass the event payload as expected by Lambda
    };

    // Invoke the Lambda function using the v3 SDK
    const command = new InvokeCommand(params);
    const lambdaResponse = await lambdaClient.send(command);
    console.log("Lambda response:", lambdaResponse);

    if (lambdaResponse.StatusCode === 200 && lambdaResponse.Payload) {
      const parsedResponse = JSON.parse(Buffer.from(lambdaResponse.Payload).toString());

      if (parsedResponse.statusCode === 400) {
        return NextResponse.json({ error: parsedResponse.body }, { status: 400 });
      }

      // Parse the body again to extract the actual analysis data
      const parsedBody = JSON.parse(parsedResponse.body);
      const analysisData = parsedBody; // This should be the array of headings/sub-headings

      console.log("Analysis data to store in Firestore:", analysisData);

      if (!analysisData) {
        throw new Error("No analysis data found in the Lambda response.");
      }

      // Store the processed data in Firestore under the user's document
      await storeDataInFirestore(analysisData, userId);

      return NextResponse.json({ message: "Data processed and stored successfully", analysisData }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to invoke Lambda function" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
