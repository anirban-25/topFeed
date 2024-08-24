import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { storeDataInFirestore } from "@/utils/storeRedditData"; // Adjust the import based on your directory structure
import { auth, db } from "@/firebase"; // Import your Firebase configuration
import { getAuth} from "firebase/auth";

// Initialize AWS SDK with Lambda

const lambda = new AWS.Lambda({
  region: 'us-east-2',
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

export async function POST(req: Request) {
  try {
    const { subreddits } = await req.json();

    // Invoke the Lambda function
    const params = {
      FunctionName: "chatgpt", // Replace with your Lambda function name
      Payload: JSON.stringify({ subreddits }),
    };

    const lambdaResponse = await lambda.invoke(params).promise();

    if (lambdaResponse.StatusCode === 200 && lambdaResponse.Payload) {
      const parsedResponse = JSON.parse(lambdaResponse.Payload as string);
      const analysisData = parsedResponse.data; // Assuming your Lambda returns data here

      // Store data in Firestore (No need to re-authenticate the user)
      const user = auth.currentUser;
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userId = user.uid;

      // Call the storeDataInFirestore function to save data
      await storeDataInFirestore(analysisData, userId);

      return NextResponse.json({ message: "Data stored successfully", analysisData }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to invoke Lambda function" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
