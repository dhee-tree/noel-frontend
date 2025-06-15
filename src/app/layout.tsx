import type { Metadata } from "next";
import { Mountains_of_Christmas, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
  title: "Noel - Secret Santa Made Magical",
  description: "Noel makes organizing your Secret Santa gift exchange effortless, fun, and full of holiday cheer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontPoppins.variable,
          fontChristmas.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}