import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ViewModeProvider } from "@/components/recruiter-hub/useViewMode";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MainView } from "@/components/layout/MainView";
import { RecruiterHub } from "@/components/recruiter-hub/RecruiterHub";
import { LoadingTransitionProvider } from "@/components/loading/LoadingTransitionProvider";
import { SITE_URL } from "@/lib/siteUrl";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Edgar Bonilla G. | UI/UX for health, wellness and fitness",
  description:
    "Accessible product interfaces and design systems for health, wellness, endurance, and digital content.",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "(ed)studio",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "(ed)studio",
    title: "Edgar Bonilla G. | (ed)studio",
    description:
      "UI/UX for accessible health, wellness, fitness, sports, and lifestyle products.",
    images: ["/og/home.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edgar Bonilla G. | (ed)studio",
    description:
      "UI/UX for accessible health, wellness, fitness, sports, and lifestyle products.",
    images: ["/og/home.png"],
  },
};

/** Structured data for richer search and knowledge-panel results. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Edgar Bonilla G.",
  alternateName: "(ed)studio",
  url: SITE_URL,
  image: `${SITE_URL}/og/home.png`,
  jobTitle: "Product UI/UX Designer",
  email: "mailto:erbonilla@outlook.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CR",
  },
  knowsLanguage: ["es", "en"],
  sameAs: [
    "https://www.linkedin.com/in/edgarbonillag/",
    "https://github.com/erbonilla",
    "https://www.facebook.com/oxygenozar",
    "https://www.instagram.com/coacherbonilla",
  ],
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
      suppressHydrationWarning
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} ${outfit.variable}`}
    >
      <body>
        {/* Resolve theme before paint: stored choice, system, then dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('ed-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.loadingVeil='skip';}}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <LoadingTransitionProvider>
          <ViewModeProvider>
            <SiteHeader />
            <MainView>{children}</MainView>
            <SiteFooter />
            <RecruiterHub />
          </ViewModeProvider>
        </LoadingTransitionProvider>
      </body>
    </html>
  );
}
