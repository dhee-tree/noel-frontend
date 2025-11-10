import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WishlistsClientPage from "./WishlistsClientPage";

export const metadata: Metadata = {
  title: "My Wishlists",
  description: "View and manage your Secret Santa wishlists.",
};

export default async function WishlistsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return <WishlistsClientPage />;
}
