import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Providers from "./Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://addis-eats.vercel.app"
  ),
  title: {
    default: "Addis Eats",
    template: "%s | Addis Eats",
  },
  description: "Authentic Ethiopian culinary traditions, hearty stews, and vegetarian feasts delivered in Addis Ababa.",
  openGraph: {
    title: "Addis Eats",
    description: "Authentic Ethiopian culinary traditions, hearty stews, and vegetarian feasts delivered in Addis Ababa.",
    url: "/",
    siteName: "Addis Eats",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats",
    description: "Authentic Ethiopian culinary traditions, hearty stews, and vegetarian feasts delivered in Addis Ababa.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${plusJakartaSans.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        <Providers>
          <Header />
          <main className="flex-1">
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
