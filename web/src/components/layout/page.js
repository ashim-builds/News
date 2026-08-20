import TopBar from "./TopBar";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Root layout — wraps every page.
 * Place this in app/layout.js (or pages/_app.js for Pages Router).
 *
 * Usage (App Router):
 *   export default function RootLayout({ children }) { ... }
 *
 * Usage (Pages Router):
 *   export default function MyApp({ Component, pageProps }) { ... }
 */
export default function RootLayout({ children }) {
  return (
    <html lang="ne">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>स्मार्ट सञ्चार — नेपालको भरपर्दो अनलाइन समाचार पोर्टल | Smart Sanchar</title>

        {/* Nepali / Devanagari font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-gray-50"
        style={{ fontFamily: "'Mukta', 'Noto Sans Devanagari', sans-serif" }}
      >
        {/* 1. Dark top strip — clock, ticker, social icons */}
        <TopBar />

        {/* 2. White header — logo + ad space */}
        <Header />

        {/* 3. Cyan sticky navbar — main navigation */}
        <Navbar />

        {/* 4. Page content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-5">
          {children}
        </main>

        {/* 5. Footer */}
        <Footer />
      </body>
    </html>
  );
}