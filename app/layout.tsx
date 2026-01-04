import type React from "react"
// <CHANGE> Updated metadata for Gospel Conference website
import type { Metadata } from "next"
import { Geist, Geist_Mono, League_Spartan, DM_Sans } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-spartan-font",
})
const _dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans-font",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gospelconference.ca'),
  title: "Gospel Conference 2026 - Christ The True and Better",
  description:
    "Join us for Gospel Conference 2026: Christ The True and Better. March 18-20 in East Gwillimbury, Ontario.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/websitelogo.svg',
    apple: '/websitelogo.svg',
  },
  openGraph: {
    title: "Gospel Conference 2026 - Christ The True and Better",
    description: "Join us for Gospel Conference 2026: Christ The True and Better. March 18-20 in East Gwillimbury, Ontario.",
    url: "https://gospelconference.ca",
    siteName: "Gospel Conference",
    images: [
      {
        url: "/websitelogo.svg",
        width: 1200,
        height: 630,
        alt: "Gospel Conference 2026 - Christ The True and Better",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gospel Conference 2026 - Christ The True and Better",
    description: "Join us for Gospel Conference 2026: Christ The True and Better. March 18-20 in East Gwillimbury, Ontario.",
    images: ["/websitelogo.svg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${_geist.className} ${_spartan.variable} ${_dmSans.variable} font-sans antialiased bg-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
