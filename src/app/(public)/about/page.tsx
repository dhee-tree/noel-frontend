import type { Metadata } from "next";
import AboutClientPage from "@/app/(public)/about/AboutClientPage";

export const metadata: Metadata = {
  title: "About NOEL",
  description: "Learn more about NOEL and its features.",
};

export default function AboutPage() {
  return <AboutClientPage />;
}
