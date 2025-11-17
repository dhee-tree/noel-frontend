import type { Metadata } from "next";
import { Mountains_of_Christmas, Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { InactivityProvider } from "@/context/InactivityProvider";
import { auth } from "@/auth";

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
    url: process.env.NEXT_PUBLIC_BASE_URL,
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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontPoppins.variable,
          fontChristmas.variable
        )}
        suppressHydrationWarning
      >
        <AuthProvider session={session}>
          <InactivityProvider>{children}</InactivityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
