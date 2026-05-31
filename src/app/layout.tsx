import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ViewModeProvider } from "@/components/recruiter-hub/useViewMode";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MainView } from "@/components/layout/MainView";
import { RecruiterHub } from "@/components/recruiter-hub/RecruiterHub";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-code",
  display: "swap",
});

// Brand wordmark face: (ed) at Regular (400), studio at Medium (500).
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-brand",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edstudio-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Edgar Bonilla G. | UI/UX for health, wellness and fitness",
  description:
    "Accessible product interfaces and design systems for health, wellness, endurance, and digital content.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "(ed)studio",
  },
  openGraph: {
    title: "Edgar Bonilla G. | (ed)studio",
    description:
      "UI/UX for accessible health, wellness, fitness, sports, and lifestyle products.",
    images: ["/og/home.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FF4F18",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // respects iOS safe-area insets
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} ${outfit.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ViewModeProvider>
          <SiteHeader />
          <MainView>{children}</MainView>
          <SiteFooter />
          <RecruiterHub />
        </ViewModeProvider>
      </body>
    </html>
  );
}
