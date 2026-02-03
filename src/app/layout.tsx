import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Toaster } from "@/components/ui/toaster";
import { businessConfig, siteConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${businessConfig.name} - Bar Restaurante en Las Tablas, Madrid`,
    template: `%s | ${businessConfig.name}`,
  },
  description: `${businessConfig.name} - El nuevo lugar de encuentro del barrio de Las Tablas. Desayunos, menú del día, tapas y terraza. Reservas: ${businessConfig.phone}`,
  keywords: [
    "restaurante Las Tablas",
    "bar Las Tablas",
    "tapas Madrid",
    "menú del día Las Tablas",
    "terraza Las Tablas",
    "desayunos Las Tablas",
    "La Rufeta",
    "restaurante Madrid norte",
  ],
  authors: [{ name: businessConfig.name }],
  creator: businessConfig.name,
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    url: siteConfig.url,
    siteName: businessConfig.name,
    title: `${businessConfig.name} - Bar Restaurante en Las Tablas, Madrid`,
    description: "El nuevo lugar de encuentro del barrio de Las Tablas. Desayunos, menú del día, tapas y terraza.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: businessConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${businessConfig.name} - Bar Restaurante`,
    description: "El nuevo lugar de encuentro del barrio de Las Tablas, Madrid.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "verification_token", // Add when available
  },
};

// JSON-LD structured data for the restaurant
function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: businessConfig.name,
    description: "Bar Restaurante en el barrio de Las Tablas, Madrid. Desayunos, menú del día, tapas y terraza.",
    url: siteConfig.url,
    telephone: businessConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessConfig.address.street,
      addressLocality: businessConfig.address.city,
      addressRegion: businessConfig.address.region,
      postalCode: businessConfig.address.postalCode,
      addressCountry: businessConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessConfig.coordinates.latitude,
      longitude: businessConfig.coordinates.longitude,
    },
    servesCuisine: businessConfig.cuisineType,
    priceRange: businessConfig.priceRange,
    acceptsReservations: businessConfig.accepts.reservations,
    ...(businessConfig.openingHours.hours.length > 0 && {
      openingHoursSpecification: businessConfig.openingHours.hours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days.split("-").map((d) => {
          const dayMap: Record<string, string> = {
            Mo: "Monday",
            Tu: "Tuesday",
            We: "Wednesday",
            Th: "Thursday",
            Fr: "Friday",
            Sa: "Saturday",
            Su: "Sunday",
          };
          return dayMap[d] || d;
        }),
        opens: h.open,
        closes: h.close,
      })),
    }),
    image: `${siteConfig.url}/images/og-image.jpg`,
    sameAs: [
      businessConfig.social.instagram,
      businessConfig.social.facebook,
    ].filter(Boolean),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData()),
          }}
        />
        {siteConfig.analytics.plausibleDomain && (
          <script
            defer
            data-domain={siteConfig.analytics.plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <CookieConsent />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
