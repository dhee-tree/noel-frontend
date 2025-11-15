import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WishlistDetailClientPage from "./WishlistDetailClientPage";

export const metadata: Metadata = {
  title: "Wishlist Details",
  description: "View and manage your wishlist items.",
};

export default async function WishlistDetailPage({
  params,
}: {
  params: Promise<{ wishlistId: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { wishlistId } = await params;

  return <WishlistDetailClientPage wishlistId={wishlistId} />;
}
