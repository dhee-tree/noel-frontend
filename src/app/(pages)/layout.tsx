import React from "react";
import { AuthNavbar } from "@/components/navigation/AuthNavbar/AuthNavbar";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AuthNavbar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
