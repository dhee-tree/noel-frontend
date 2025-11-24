import type { Metadata } from "next";
import PrivacyClientPage from "@/app/(public)/privacy/PrivacyClientPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read about NOEL's commitment to your privacy and data protection.",
};

export default function PrivacyPage() {
  return <PrivacyClientPage />;
}
