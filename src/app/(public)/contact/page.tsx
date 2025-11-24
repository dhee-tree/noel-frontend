import type { Metadata } from "next";
import ContactClientPage from "@/app/(public)/contact/ContactClientPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the NOEL team for support or inquiries.",
};

export default function ContactPage() {
  return <ContactClientPage />;
}
