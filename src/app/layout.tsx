import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AppProvider } from "@/contexts/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TopFeed AI | Find Trending Topics from Reddit and X",
  description: "TopFeed AI can summarize news from Reddit discussions and tweets from X. Find trending topics with personalized insights for your business in real-time.",
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-T6C8KG03Q6"
        ></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-T6C8KG03Q6');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AppProvider>
          <div className="min-h-screen">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}