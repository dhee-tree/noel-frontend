import React from "react";
import { SiteHeader } from "@/components/landing/SiteHeader/SiteHeader";
import { Snowfall } from "@/components/landing/Snowfall/Snowfall";
import { SiteFooter } from "@/components/landing/Footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Snowfall />
      <SiteHeader />
      <main style={{ width: "100%", overflow: "hidden" }}>{children}</main>
      <SiteFooter />
    </div>
  );
}
