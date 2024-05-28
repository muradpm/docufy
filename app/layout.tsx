import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/config/site";
import { Inter } from "next/font/google";
import AuthProvider from "./api/auth/provider";
import { DisplayNavProvider } from "@/components/display-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { PHProvider } from "./providers";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const PostHogPageView = dynamic(() => import("./posthog-page-view"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI for writing",
    "AI writing assistant",
    "AI writing software",
    "AI proposal writing",
    "AI creative writing assistant",
  ],
  authors: [
    {
      name: "docufy",
      url: "https://docufy.ai",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DisplayNavProvider>
      <html lang="en" suppressHydrationWarning>
        <AuthProvider>
          <PHProvider>
            <body className={inter.className}>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <PostHogPageView />
                {children}
                <SpeedInsights />
              </ThemeProvider>
              <Toaster />
            </body>
          </PHProvider>
        </AuthProvider>
      </html>
    </DisplayNavProvider>
  );
}
