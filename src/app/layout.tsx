import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "TopFeed",
  description:
    "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

      <meta name="robots" content="noindex" />
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
        <div className="min-h-screen">{children}</div>
        
      </body>
    </html>
  );
}
