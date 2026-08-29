import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Noto_Sans_Devanagari } from 'next/font/google';
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
  openGraph: {
    title: "स्मार्ट सञ्चार - नेपालको भरपर्दो अनलाइन समाचार पोर्टल | Smart Sanchar",
    description: "स्मार्ट सञ्चार - ताजा, निष्पक्ष र भरपर्दो समाचार। राजनीति, अर्थतन्त्र, खेलकुद, प्रविधि र अन्तर्राष्ट्रिय समाचार।",
    url: "https://www.smartsanchar.com",
    siteName: "स्मार्ट सञ्चार",
    images: [
      {
        url: "https://www.smartsanchar.com/logo.jpg",
        width: 1200,
        height: 630,
        alt: "स्मार्ट सञ्चार",
      },
    ],
    locale: "ne_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "स्मार्ट सञ्चार - नेपालको भरपर्दो अनलाइन समाचार पोर्टल | Smart Sanchar",
    description: "स्मार्ट सञ्चार - ताजा, निष्पक्ष र भरपर्दो समाचार। राजनीति, अर्थतन्त्र, खेलकुद, प्रविधि र अन्तर्राष्ट्रिय समाचार।",
    images: ["https://www.smartsanchar.com/logo.jpg"],
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
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
            crossOrigin="anonymous"
          />
        )}
        <SecurityProvider>
          {children}
        </SecurityProvider>
      </body>
    </html>
  );
}
