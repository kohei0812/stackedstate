import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Stacked State",
  description: "Stacked Stateの公式サイト。最新情報、ライブスケジュールをお届けします。",
  metadataBase: new URL("https://stackedstate.com"),
  openGraph: {
    title: "Stacked State",
    description: "Stacked Stateの公式サイト。最新情報、ライブスケジュールをお届けします。",
    url: "https://stackedstate.com",
    siteName: "Stacked State",
    images: [
      {
        url: "/asset/img/header_logo.png",
        width: 800,
        height: 600,
        alt: "Stacked State ロゴ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@stackedstate",
    creator: "@otherguy0721",
    images: ["https://stackedstate.com/asset/img/header_logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
