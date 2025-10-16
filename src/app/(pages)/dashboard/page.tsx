import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClientPage from "@/app/(pages)/dashboard/DashboardClientPage";

export const metadata: Metadata = {
  title: "Your Dashboard",
  description: "Manage your Secret Santa groups.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return <DashboardClientPage session={session} />;
}
