import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { WebSiteSchema } from "@/components/seo";
import ToastProvider from "@/components/providers/ToastProvider";
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Edwuma - Jobs in Africa | Ghana, Nigeria, Kenya & South Africa",
    template: "%s | Edwuma"
  },
  description: "Find jobs across Africa with Edwuma, the leading job portal for Ghana, Nigeria, Kenya, and South Africa. Browse thousands of career opportunities, from tech to finance, remote work to on-site positions. Start your African career journey today.",
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
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Edwuma",
    title: "Edwuma - Jobs in Africa | Find Your Dream Career",
    description: "Discover thousands of job opportunities across Africa. Connect with top employers in Ghana, Nigeria, Kenya, and South Africa.",
    images: [
      {
        url: "/edwuma-logo-2023.png",
        width: 1200,
        height: 630,
        alt: "Edwuma - African Job Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edwuma - Jobs in Africa",
    description: "Find jobs across Ghana, Nigeria, Kenya, and South Africa. Your African career starts here.",
    images: ["/edwuma-logo-2023.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-REZ4R5TQBW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-REZ4R5TQBW');
          `}
        </Script>

        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
