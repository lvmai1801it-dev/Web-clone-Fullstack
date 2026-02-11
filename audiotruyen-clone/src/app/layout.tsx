import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { MobileComponents } from "@/components/mobile/MobileComponents";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotruyen-clone.vercel.app'),
  title: {
    default: "AudioTruyen Clone - Nghe Truyện Audio Online Miễn Phí",
    template: "%s | AudioTruyen Clone"
  },
  description: "Website nghe truyện audio online miễn phí với hàng nghìn tác phẩm hay. Clone từ AudioTruyen.org - Tiên hiệp, huyền huyễn, kiếm hiệp, ngôn tình.",
  keywords: ["audio truyện", "nghe truyện", "truyện audio", "truyện tiên hiệp", "truyện huyền huyễn", "truyện ngôn tình", "truyện kiếm hiệp"],
  authors: [{ name: "AudioTruyen Clone" }],
  creator: "AudioTruyen Clone",
  publisher: "AudioTruyen Clone",
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
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotruyen-clone.vercel.app',
    siteName: "AudioTruyen Clone",
    title: "AudioTruyen Clone - Nghe Truyện Audio Online Miễn Phí",
    description: "Website nghe truyện audio online miễn phí với hàng nghìn tác phẩm hay. Tiên hiệp, huyền huyễn, kiếm hiệp, ngôn tình.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AudioTruyen Clone - Nghe Truyện Audio Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AudioTruyen Clone - Nghe Truyện Audio Online Miễn Phí",
    description: "Website nghe truyện audio online miễn phí với hàng nghìn tác phẩm hay.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotruyen-clone.vercel.app',
  },
};

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { AudioProvider } from "@/contexts/AudioContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Skip to main content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded"
        >
          Chuyển đến nội dung chính
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AudioProvider>

            <Header />
            <main id="main-content" className="min-h-screen pb-16 md:pb-0">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>

            {/* Mobile-only components (dynamic loaded) */}
            <MobileComponents />

            <Footer />

          </AudioProvider>
        </ThemeProvider>
      </body >
    </html >
  );
}

