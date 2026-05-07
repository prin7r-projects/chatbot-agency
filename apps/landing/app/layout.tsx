import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dispatch — chatbot agency · Telegram, Discord, WhatsApp · 5-day delivery",
  description:
    "Productized chatbot agency. Spec on Monday, bot live by Friday. One knowledge base, three channels, one bill. Starter $299 + $79/mo, Growth $599 + $199/mo, Pro $1,200 + $449/mo.",
  metadataBase: new URL("https://chatbot-agency.prin7r.com"),
  openGraph: {
    title: "Dispatch — chatbot agency",
    description:
      "Spec on Monday, bot live by Friday. Telegram, Discord, WhatsApp from one knowledge base.",
    url: "https://chatbot-agency.prin7r.com",
    siteName: "Dispatch",
    type: "website"
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#hero" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
