import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Providers from "./Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Habesha Restaurant",
    template: "%s | Habesha Restaurant",
  },
  description: "Authentic Ethiopian dishes and cuisine",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${plusJakartaSans.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <Providers>
          <Header />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
            {children}
          </main>
          <Footer />
        </Providers>
        <Script
          src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
