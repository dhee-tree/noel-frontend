import ResetPasswordClientPage from "./ResetPasswordClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Request a password reset email.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClientPage />;
}
