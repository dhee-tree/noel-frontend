import type { Metadata } from "next";
import GiftIdeasClientPage from "@/app/(public)/gift-ideas/GiftIdeasClientPage";

export const metadata: Metadata = {
  title: "Gift Ideas",
  description: "Discover perfect gift ideas for your Secret Santa.",
};

export default function GiftIdeasPage() {
  return <GiftIdeasClientPage />;
}
