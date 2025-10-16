import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import GroupsClientPage from "@/app/(pages)/groups/GroupsClientPage";

export const metadata: Metadata = {
  title: "Groups",
  description: "Manage your Secret Santa groups.",
};

export default async function GroupsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return <GroupsClientPage />;
}
