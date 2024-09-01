import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import admin from "firebase-admin"; // Assume fetchFeeds is exported from a utils file
import axios from "axios";
import { parse } from "node-html-parser";
import { OpenAI } from "openai";
import { parseISO, subHours, subMinutes } from "date-fns";
import { getUserNotificationSettings, sendTelegramMessage } from "@/utils/notificationUtils";
// Initialize Firebase Admin SDK (if not already initialized elsewhere)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "topfeed-123",
      clientEmail:
        "firebase-adminsdk-6mx07@topfeed-123.iam.gserviceaccount.com",
      privateKey:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1OnfEjnPLfrSo\nOCujizCA5Qb8yg7rcztlyRkXaPI/a5IJeBw/m6kJM9j/uaYKo1Dx10V2CjB4Xc4S\nWCWfv3NZTb7VLZ2zAkIyd3lPNoRQMzTHvkCpTBxvTcTTtrhSkJTtFNnz1QKkHkEQ\n82G1IsFDux87zvAe3nq1PD3UwXzrk1KFUvsDOcfoOIQLuTswsWpW+uV6ouXS13ca\nk6Lm4kgAZnitLbKTLnfYJxBoFzx/i/UPlA0PAPjBgtBpF95xofbOe6+z/HNxivsb\nXRaX1AaPZ0tEVhXXVLcrrz9chEKdSXaK1gpd/V4xWexSexV2j2F2MgV9hDsS4SzR\nA82gTNZXAgMBAAECggEAV/cNvEPS09LoGIDPOb4taFsChcAD9ugDTDgMrE69yufJ\nRjxdJcjGBxf5+8JeZGp6NzDg39c5SKtrg37yoDQa5p10g9/03Dc772gLY1YYah84\nvr1LgIFXifULFSJrHHRePSdyVUau1f9zYKlp4zR/74LLucmLxsgBcqfPcU4LdwJF\nN5qgXbKlsWyrQ/qbDzxnZqXwL6TipT4NVKQ9QpflY+DF+B1D4dTH07zitJJI1Caq\nzhgUAsTN/XCpcqbTI61UgLT+mvS3XlaHoVvdIZBRPJI/MeJx2Ro9qQ9FVHnsR+ky\nR2xYYhYuEyTi1sTvOOz4LPN6t02HcVTeRwjdTUYiSQKBgQDlY1WUq5YlzYD1XkZq\nUXa5ro8/5JOvv4MxTWhCT9wumsPyVvEgQ2EhrRNLKz35Xeegy2MJ9Ek4NMjO7ChF\n4tjT/6IwbA/2kAU2dEy1aUl07oPnp2vlTfcvVqAT4bGZ/81O7hRudDpI9X1Bfoe1\n3fGQuaDcaYPlCJoN9Zr04RM1mQKBgQDKQNNhEYo7Tpnz1uQVFMheM4Bb2lXNjjcf\nmw9leekAxurrLtZg3bu5GA0E2MKSmkCPBjSPb8ZjhVZt1MQPThERiZVb878pKi13\nK692Nf5rpwhi1dWyyZvtDaOMpjOlnmcQd1+5EPpPBoW9nCNSSVVbg9qcLnbMtkcj\nyHPAp7sBbwKBgCaRZBNCIlWqztLyje5UUhz4L5ezi+1RyvIgLLZxjPi9BtMZMSOW\nkJ9D5WmPFLV3x3kumTFURHdR0K2R4VeWw5QpeBCiKrDvGCFGvpsF39bsP3tUl/yO\n9k+cRf/xw5W7/74Uo5TKr/4SYIQBjTnT3kjSHSzSBN4eayCLugkQStWJAoGAZmJa\nnxDaARvRI3btDx7uL4GywMzOErijfwRnzt7f7NzFnzienXqhxRk/vexc0wnzFHP3\nt4TF0St2jTLf7T9/tHkJevrxEk2fpmwe7qB2othzjlThURhuLppw6IpaKsT9N4C2\nnGDT1Z1fppSb7NPiuekNiXKcARVk/eBDeItwR1ECgYEAw4sCxMM2Z8iP030erkAn\nX53u/wfSWScsMvnTr/kCp2lILFlIVUGdtpoxbFzPj6e3mH+gOlcs4pOKSZshC3q3\n/H0zAF3fRq1i3mvKRRWIfouePytf5TfmV9hpL9RmaIfkGjWuNGthncRLqeDuWqVI\n68L1U5jvaM2RZmOlyS1nCqU=\n-----END PRIVATE KEY-----\n",
    }),
  });
}

const db = admin.firestore();

const MODEL = "gpt-4o";
const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const client = new OpenAI({ apiKey: api_key });

// Utility Functions
function extractLinks(text: string): string[] {
  const urlPattern = /https?:\/\/\S+|www\.\S+/g;
  return text.match(urlPattern) || [];
}

function excludeLinks(text: string): string {
  const urlPattern = /https?:\/\/\S+|www\.\S+|\b\w+\.com\b|\b\w+\.\S+/g;
  return text.replace(urlPattern, "");
}

async function fetchMetaTitle(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 5000, // 5 seconds timeout
    });
    if (response.status === 200) {
      const root = parse(response.data);
      const title =
        root.querySelector("title")?.text ||
        root
          .querySelector('meta[property="og:title"]')
          ?.getAttribute("content") ||
        root
          .querySelector('meta[name="twitter:title"]')
          ?.getAttribute("content") ||
        "No Title Found";
      return title.trim();
    }
    return "Failed to fetch";
  } catch (error) {
    console.error(
      `Error fetching meta title for ${url}: ${(error as Error).message}`
    );
    return url; // Return the URL itself if we can't fetch the title
  }
}

interface FilteredData {
  text: string;
  meta_titles: string[];
  url?: string;
  content_html?: string;
  authors?: string[];
  relevancy?: string;
}

function shouldSendNotification(
  relevancy: string,
  notificationLevels: string[]
): boolean {
  return notificationLevels.includes(relevancy);
}

async function feedToGPT(
  filtered: FilteredData[],
  newTopic: string, id: string, notificationLevels: string[], telegramUserId: string
): Promise<FilteredData[]> {
  for (const row of filtered) {
    const title = String(row.text).trim();
    const contentText = String(row.meta_titles);
    const summaryInput = `text: ${title}\nMeta Title of Data mentioned via url: ${contentText}`;

    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are an AI assistant helping to categorize tweets based on their relevancy to -> ${newTopic}. PS: the words provided before should be strictly measured, Match in words should not be taken as relevancy, rather give preferrence to the algorithms and details. You will provide one word answer, either High, Medium, Low. The description will include detailed topics and areas of interest. Each tweet should be categorized into one of three relevancy levels: high, medium, or low. Use the following criteria to determine the relevancy:\nHigh Relevancy: The tweet directly discusses the key elements of the specified description in detail, providing valuable insights, updates, strategies, or news specifically about those elements. The content is focused and highly relevant to the description, addressing specific aspects or details mentioned in the description.\nMedium Relevancy: The tweet mentions elements of the specified description but does not focus exclusively on them. It may include some useful information, tips, or brief mentions related to the description. While it might cover related topics, it does not delve deeply into the specifics outlined in the description.\nLow Relevancy: The tweet mentions related but distinct topics or focuses on other areas. It does not provide substantial information or insights about the specific elements mentioned in the description. The relevance to the specified description is minimal or tangential.`,
          },
          { role: "user", content: title },
        ],
        max_tokens: 3000,
        temperature: 0,
      });
      row.relevancy = response.choices[0].message.content ?? "low";
      // row.relevancy = "high";
      try {
        if (shouldSendNotification(row.relevancy, notificationLevels)) {
          const message = `${row.url}`;
          await sendTelegramMessage(telegramUserId, message);
        }
      } catch (error) {
        
      }
    } catch (error) {
      console.error(`Error in GPT-4 processing: ${error}`);
    }
  }
  return filtered;
}

interface TwitterData {
  title: string;
  link: string;
  date_published: string;
  content_html: string;
  content_text: string;
  url: string;
  authors: string[];
  links?: string[];
  text?: string;
  meta_titles?: string[];
}

async function fetchRssFeeds(
  urls: string[],
  newTopic: string,
  id: string,
  notificationLevels: string[], telegramUserId: string
): Promise<FilteredData[]> {
  const twitterData: TwitterData[] = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const items = response.data.items || [];
        for (const item of items) {
          twitterData.push({
            title: item.title,
            link: item.link,
            date_published: item.date_published,
            content_html: item.content_html,
            content_text: item.content_text,
            url: item.url,
            authors: item.authors,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching RSS feed: ${error}`);
    }
  }

  // Filter and process data
  const currentDate = new Date();
  const fifteenMinutesAgo = subMinutes(currentDate, 15);
  const filteredData = twitterData
    .filter((item) => parseISO(item.date_published) > fifteenMinutesAgo)
    .sort(
      (a, b) =>
        parseISO(b.date_published).getTime() -
        parseISO(a.date_published).getTime()
    )
    .map((item) => ({
      ...item,
      links: extractLinks(item.content_text),
      text: excludeLinks(item.content_text),
    }));

  // Fetch meta titles
  for (const item of filteredData) {
    item.meta_titles = await Promise.all(
      (item.links ?? []).map(fetchMetaTitle)
    );
  }

  const filtered: FilteredData[] = filteredData.map(
    ({ text, meta_titles, url, content_html, authors }) => ({
      text: text ?? "",
      meta_titles: meta_titles ?? [],
      url,
      content_html,
      authors,
    })
  );

  return feedToGPT(filtered, newTopic, id, notificationLevels, telegramUserId);
}

async function fetchFeeds(
  twitterUrls: string[],
  newTopic: string,
  id: string,
  notificationLevels: string[], telegramUserId: string
): Promise<FilteredData[]> {
  const urls: string[] = [];
  const apiUrl = "https://api.rss.app/v1/feeds";
  const headers = {
    Authorization: "Bearer c_nNbfzK4dAWoTxY:s_WIHFi2i4TLEx6YFbNvitWY",
    "Content-Type": "application/json",
  };

  for (const twitterUrl of twitterUrls) {
    const query = await db
      .collection("all_tweet_feeds")
      .where("twitter_url", "==", twitterUrl)
      .limit(1)
      .get();

    if (!query.empty) {
      const doc = query.docs[0];
      urls.push(doc.data().rss_feed_url);
    } else {
      try {
        const response = await axios.post(
          apiUrl,
          { url: twitterUrl },
          { headers }
        );
        if (response.status === 200 && response.data.rss_feed_url) {
          const feedId = response.data.rss_feed_url
            .split("/")
            .pop()
            ?.replace(".xml", "");
          const newFeedUrl = `http://rss.app/feeds/v1.1/${feedId}.json`;
          urls.push(newFeedUrl);

          await db.collection("all_tweet_feeds").add({
            twitter_url: twitterUrl,
            rss_feed_url: newFeedUrl,
          });
        }
      } catch (error) {
        console.error(`Error processing URL ${twitterUrl}: ${error}`);
      }
    }
  }

  return fetchRssFeeds(urls, newTopic, id, notificationLevels, telegramUserId);
}
export async function GET(request: NextRequest) {
  try {
    console.log("Starting GET function");
    // const { searchParams } = new URL(request.url);
    // const forceRefresh = searchParams.get('refresh') === 'true';

    // if (forceRefresh) {
    //   console.log("Force refresh requested. Bypassing cache.");
    //   // You might want to add logic here to clear any local caches
    //   // or set flags to ensure fresh data is fetched
    // }

    const usersSnapshot = await db.collection("users").get();
    console.log(`Number of users: ${usersSnapshot.size}`);

    const allResults = await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        console.log(`Processing user: ${userDoc.id}`);
        const tweetFeedSnapshot = await userDoc.ref
          .collection("tweet_feed")
          .limit(1)
          .get();

        if (!tweetFeedSnapshot.empty) {
          const tweetFeedDoc = tweetFeedSnapshot.docs[0];
          const tweetFeedData = tweetFeedDoc.data();
          console.log(`User ${userDoc.id} - Tweet feed data:`, tweetFeedData);
          var notificationLevels: string[] = [];
          var telegramUserId = ""
          const userSettings = await getUserNotificationSettings(userDoc.id);
          if (userSettings) {
            notificationLevels = userSettings.notificationLevels || [];
            telegramUserId = userSettings.telegramUserId || "";
          }
          
          if (tweetFeedData.twitterUrls && tweetFeedData.topic) {
            try {
              const result = await fetchFeeds(
                tweetFeedData.twitterUrls,
                tweetFeedData.topic,
                userDoc.id,
                notificationLevels, telegramUserId
              );
              console.log(`User ${userDoc.id} - fetchFeeds result:`, result);

              // Update user_tweets subcollection
              const userTweetsRef = userDoc.ref.collection("user_tweets");
              const batch = db.batch();

              for (const tweet of result) {
                const newTweetRef = userTweetsRef.doc();
                batch.set(newTweetRef, {
                  content_html: tweet.content_html,
                  authors: tweet.authors,
                  relevancy: tweet.relevancy,
                });
              }

              await batch.commit();
              console.log(`Updated user_tweets for user ${userDoc.id}`);

              return {
                userId: userDoc.id,
                tweetFeedId: tweetFeedDoc.id,
                result,
              };
            } catch (error) {
              console.error(
                `Error in fetchFeeds for user ${userDoc.id}:`,
                error
              );
              return null;
            }
          } else {
            console.log(`Missing twitterUrls or topic for user ${userDoc.id}`);
          }
        } else {
          console.log(`No tweet_feed found for user ${userDoc.id}`);
        }
        return null;
      })
    );

    const filteredResults = allResults.filter((result) => result !== null);
    console.log(`Total results: ${filteredResults.length}`);
    const response = NextResponse.json({
      results: filteredResults,
      timestamp: new Date().toISOString(),
    });

    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error(`Error processing data:`, error);
    const errorResponse = NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return errorResponse;
  }
}
