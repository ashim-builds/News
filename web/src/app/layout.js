import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Noto_Sans_Devanagari } from 'next/font/google';
import Script from "next/script";
import SecurityProvider from "@/components/providers/SecurityProvider";
const noto = Noto_Sans_Devanagari({ subsets: ['devanagari'] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "स्मार्ट सञ्चार - नेपालको भरपर्दो अनलाइन समाचार पोर्टल | Smart Sanchar",
  description: "स्मार्ट सञ्चार - ताजा, निष्पक्ष र भरपर्दो समाचार। राजनीति, अर्थतन्त्र, खेलकुद, प्रविधि र अन्तर्राष्ट्रिय समाचार।",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({ children }) {
  const adSenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {adSenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <SecurityProvider>
          {children}
        </SecurityProvider>
      </body>
    </html>
  );
}
