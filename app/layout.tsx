import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { WebSiteSchema } from "@/components/seo";
import ToastProvider from "@/components/providers/ToastProvider";
import CookieConsent from "@/components/cookies/CookieConsent";
import "@/lib/api/debug-auth"; // Debug utility for authentication

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Jobs you can apply to today | Edwuma",
    template: "%s | Edwuma"
  },
  description: "A short list of open jobs in Ghana, Nigeria, Kenya, and South Africa. No fee. One link to apply.",
  keywords: [
    "jobs in Africa",
    "jobs in Ghana",
    "jobs in Nigeria", 
    "jobs in Kenya",
    "jobs in South Africa",
    "African jobs",
    "careers Africa",
    "remote jobs Africa",
    "tech jobs Ghana",
    "engineering jobs Nigeria",
    "finance jobs Kenya",
    "Accra jobs",
    "Lagos jobs",
    "Nairobi jobs",
    "Johannesburg jobs",
    "African employment",
    "job search Africa",
    "career opportunities Africa"
  ],
  authors: [{ name: "Edwuma Team", url: baseUrl }],
  creator: "Edwuma",
  publisher: "Edwuma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "64x64" },
    ],
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Edwuma",
    title: "Jobs you can apply to today | Edwuma",
    description: "A short list of open jobs in Ghana, Nigeria, Kenya, and South Africa. No fee. One link to apply.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs you can apply to today | Edwuma",
    description: "A short list of open jobs in Ghana, Nigeria, Kenya, and South Africa. No fee. One link to apply.",
    creator: "@edwuma",
    site: "@edwuma",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    // bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <WebSiteSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${jakarta.className} antialiased font-sans`}
      >
        <AuthProvider>
          <ToastProvider />
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
