import type { Metadata } from "next";
import LoginClientPage from "@/app/(public)/login/LoginClientPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Secret Santa account.",
};

export default function LoginPage() {
  return <LoginClientPage />;
}
