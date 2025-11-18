import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileClientPage from "./ProfileClientPage";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile information.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return <ProfileClientPage />;
}
