import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { siteConfig } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    type: siteConfig.openGraph.type,
    locale: siteConfig.openGraph.locale,
    url: siteConfig.openGraph.url,
    title: siteConfig.openGraph.title,
    description: siteConfig.openGraph.description,
    siteName: siteConfig.openGraph.siteName,
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: siteConfig.twitter.title,
    description: siteConfig.twitter.description,
    creator: siteConfig.twitter.creator,
  },
  metadataBase: new URL(siteConfig.url),
  verification: {
    google: "eSMQ4SbDoPoAWpB1xXV9Ex-jbmSWbjL1xGZGndWZ8Fo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-MRWXLFF3VB"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MRWXLFF3VB');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
