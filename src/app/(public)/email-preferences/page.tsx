import type { Metadata } from "next";
import EmailPreferencesClientPage from "@/app/(public)/email-preferences/EmailPreferencesClientPage";

export const metadata: Metadata = {
  title: "Email Preferences",
  description: "Manage your email preferences for Secret Santa notifications.",
};

export default async function EmailPreferencesPage() {
  return <EmailPreferencesClientPage />;
}
