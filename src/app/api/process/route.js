import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'node-html-parser';
import admin from 'firebase-admin';
import { OpenAI } from 'openai';
import { parseISO, subHours } from 'date-fns';

// Initialize Firebase Admin SDK (if not already initialized elsewhere)
if (!admin.apps.length) {
  const serviceAccount = require('./config/firebase_service_account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

const MODEL = "gpt-4o";
const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const client = new OpenAI({ apiKey: api_key });

// Utility Functions
function extractLinks(text) {
  const urlPattern = /https?:\/\/\S+|www\.\S+/g;
  return text.match(urlPattern) || [];
}

function excludeLinks(text) {
  const urlPattern = /https?:\/\/\S+|www\.\S+|\b\w+\.com\b|\b\w+\.\S+/g;
  return text.replace(urlPattern, '');
}

async function fetchMetaTitle(url) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const root = parse(response.data);
      const title = root.querySelector('title')?.text || 'No Title Found';
      return title;
    }
    return 'Failed to fetch';
  } catch (error) {
    console.error(`Error fetching meta title: ${error}`);
    return String(error);
  }
}

async function feedToGPT(filtered, newTopic) {
  for (const row of filtered) {
    const title = String(row.text).trim();
    const contentText = String(row.meta_titles);
    const summaryInput = `text: ${title}\nMeta Title of Data mentioned via url: ${contentText}`;

    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: `You are an AI assistant helping to categorize tweets based on their relevancy to -> ${newTopic}. PS: the words provided before should be strictly measured, Match in words should not be taken as relevancy, rather give preferrence to the algorithms and details. You will provide one word answer, either High, Medium, Low. The description will include detailed topics and areas of interest. Each tweet should be categorized into one of three relevancy levels: high, medium, or low. Use the following criteria to determine the relevancy:\nHigh Relevancy: The tweet directly discusses the key elements of the specified description in detail, providing valuable insights, updates, strategies, or news specifically about those elements. The content is focused and highly relevant to the description, addressing specific aspects or details mentioned in the description.\nMedium Relevancy: The tweet mentions elements of the specified description but does not focus exclusively on them. It may include some useful information, tips, or brief mentions related to the description. While it might cover related topics, it does not delve deeply into the specifics outlined in the description.\nLow Relevancy: The tweet mentions related but distinct topics or focuses on other areas. It does not provide substantial information or insights about the specific elements mentioned in the description. The relevance to the specified description is minimal or tangential.` },
          { role: "user", content: title }
        ],
        max_tokens: 3000,
        temperature: 0,
      });
      row.relevancy = response.choices[0].message.content;
    } catch (error) {
      console.error(`Error in GPT-4 processing: ${error}`);
    }
  }
  return filtered;
}

async function fetchRssFeeds(urls, newTopic) {
  const twitterData = [];

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
  const twoDaysAgo = subHours(currentDate, 48);
  const filteredData = twitterData
    .filter(item => parseISO(item.date_published) > twoDaysAgo)
    .sort((a, b) => parseISO(b.date_published) - parseISO(a.date_published))
    .map(item => ({
      ...item,
      links: extractLinks(item.content_text),
      text: excludeLinks(item.content_text),
    }));

  // Fetch meta titles
  for (const item of filteredData) {
    item.meta_titles = await Promise.all(item.links.map(fetchMetaTitle));
  }

  const filtered = filteredData.map(({ text, meta_titles, url, content_html, authors }) => 
    ({ text, meta_titles, url, content_html, authors }));

  return feedToGPT(filtered, newTopic);
}

async function fetchFeeds(twitterUrls, newTopic) {
  const urls = [];
  const apiUrl = "https://api.rss.app/v1/feeds";
  const headers = {
    'Authorization': 'Bearer c_nNbfzK4dAWoTxY:s_WIHFi2i4TLEx6YFbNvitWY',
    'Content-Type': 'application/json'
  };

  for (const twitterUrl of twitterUrls) {
    const query = await db.collection('all_tweet_feeds').where('twitter_url', '==', twitterUrl).limit(1).get();

    if (!query.empty) {
      const doc = query.docs[0];
      urls.push(doc.data().rss_feed_url);
    } else {
      try {
        const response = await axios.post(apiUrl, { url: twitterUrl }, { headers });
        if (response.status === 200 && response.data.rss_feed_url) {
          const feedId = response.data.rss_feed_url.split('/').pop().replace('.xml', '');
          const newFeedUrl = `http://rss.app/feeds/v1.1/${feedId}.json`;
          urls.push(newFeedUrl);

          await db.collection('all_tweet_feeds').add({
            twitter_url: twitterUrl,
            rss_feed_url: newFeedUrl
          });
        }
      } catch (error) {
        console.error(`Error processing URL ${twitterUrl}: ${error}`);
      }
    }
  }

  return fetchRssFeeds(urls, newTopic);
}

export async function POST(request) {
  try {
    const { twitterUrls, newTopic } = await request.json();

    if (!twitterUrls || !newTopic || !Array.isArray(twitterUrls)) {
      return NextResponse.json({ error: "Invalid input. 'twitterUrls' must be an array and 'newTopic' is required." }, { status: 400 });
    }

    const dfFinal = await fetchFeeds(twitterUrls, newTopic);
    return NextResponse.json({ result: dfFinal });
  } catch (error) {
    console.error(`Error processing data: ${error}`);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}