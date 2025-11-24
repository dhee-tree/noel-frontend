import type { Metadata } from "next";
import CookiesClientPage from "@/app/(public)/cookies/CookiesClientPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Understand NOEL's use of cookies and similar technologies.",
};

export default function CookiesPage() {
  return <CookiesClientPage />;
}
