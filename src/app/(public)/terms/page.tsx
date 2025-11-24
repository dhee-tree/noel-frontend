import type { Metadata } from "next";
import TermsClientPage from "@/app/(public)/terms/TermsClientPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read NOEL's terms of service and user guidelines.",
};

export default function TermsPage() {
  return <TermsClientPage />;
}
