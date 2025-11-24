import type { Metadata } from "next";
import { Mountains_of_Christmas, Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { InactivityProvider } from "@/context/InactivityProvider";
import { auth } from "@/auth";
import { CookieConsent } from "@/components/cookies/CookieConsent";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontChristmas = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-christmas",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Noel - Secret Santa Made Magical",
    template: "%s | Noel",
  },
  description:
    "Noel makes organising your Secret Santa gift exchange effortless, fun, and full of holiday cheer.",
  keywords: "Noel, Secret Santa, gift exchange, holiday cheer",
  openGraph: {
    title: "Noel - Secret Santa Made Magical",
    description:
      "Noel makes organising your Secret Santa gift exchange effortless, fun, and full of holiday cheer.",
    url: BASE_URL,
    siteName: "Noel",
    locale: "en-UK",
    type: "website",
    images: [
      {
        url: "/images/NOEL Logo.png",
        width: 800,
        height: 600,
        alt: "Noel Logo",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId={GTM_ID} />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontPoppins.variable,
          fontChristmas.variable
        )}
        suppressHydrationWarning
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <AuthProvider session={session}>
          <InactivityProvider>
            {children}
            <CookieConsent />
          </InactivityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
