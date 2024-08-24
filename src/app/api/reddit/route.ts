import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { storeDataInFirestore } from "@/utils/storeRedditData";

// Initialize AWS SDK with Lambda
const lambda = new AWS.Lambda({
  region: 'us-east-2',
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

export async function POST(req: Request) {
  try {
    const { subreddits, userId } = await req.json();
    console.log("Subreddits:", subreddits);
    console.log("User ID:", userId);
    console.log("-------------------------------------------");

    // Create a stringified JSON object for the body
    const eventPayload = {
      body: JSON.stringify({ subreddits })
    };

    // Invoke the Lambda function
    const params = {
      FunctionName: "chatgpt", // Replace with your Lambda function name
      Payload: JSON.stringify(eventPayload), // Pass the event payload as expected by Lambda
    };

    const lambdaResponse = await lambda.invoke(params).promise();
    console.log("Lambda response:", lambdaResponse);

    if (lambdaResponse.StatusCode === 200 && lambdaResponse.Payload) {
      const parsedResponse = JSON.parse(lambdaResponse.Payload as string);

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
