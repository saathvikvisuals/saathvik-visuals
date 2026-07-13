import type { Metadata } from "next";
import { Caveat, Instrument_Serif, Libre_Franklin, Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  preload: false
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
  preload: false
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-libre",
  display: "swap",
  preload: false
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
  preload: false
});

const SITE_URL = "https://saathvik-visuals.vercel.app";
const SITE_DESCRIPTION =
  "Saathvik Visuals is a trusted freelance UI/UX and product designer building cinematic product concepts, client websites, and mobile apps. A visual archive of premium design work, theme modes, and multilingual storytelling.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Saathvik Visuals | Trusted UI/UX & Product Designer",
    template: "%s | Saathvik Visuals"
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Saathvik Visuals",
    "trusted designer",
    "UI/UX designer",
    "product designer",
    "freelance designer",
    "web design portfolio",
    "mobile app design",
    "cinematic product design",
    "Saathvik Kalepu"
  ],
  authors: [{ name: "Saathvik Kalepu", url: SITE_URL }],
  creator: "Saathvik Kalepu",
  publisher: "Saathvik Visuals",
  category: "Design",
  alternates: {
    canonical: SITE_URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/brand-favicon.png",
    apple: "/brand-favicon.png"
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Saathvik Visuals",
    title: "Saathvik Visuals | Trusted UI/UX & Product Designer",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/brand-favicon.png",
        width: 512,
        height: 512,
        alt: "Saathvik Visuals"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Saathvik Visuals | Trusted UI/UX & Product Designer",
    description: SITE_DESCRIPTION,
    images: ["/brand-favicon.png"]
  }
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Saathvik Kalepu",
  alternateName: "Saathvik Visuals",
  url: SITE_URL,
  image: `${SITE_URL}/brand-favicon.png`,
  jobTitle: "UI/UX & Product Designer",
  description: SITE_DESCRIPTION,
  sameAs: [
    "https://github.com/saathvikvisuals",
    "https://www.linkedin.com/in/saathvik-kalepu-17041228b/",
    "https://www.instagram.com/sunny__fr18/"
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${raleway.variable} ${libreFranklin.variable} ${instrument.variable} ${caveat.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
