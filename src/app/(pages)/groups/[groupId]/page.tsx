import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import GroupDetailClientPage from "@/app/(pages)/groups/[groupId]/GroupDetailClientPage";

export const metadata: Metadata = {
  title: "Group Details",
  description: "View and manage your Secret Santa group.",
};

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { groupId } = await params;

  return <GroupDetailClientPage groupId={groupId} />;
}
