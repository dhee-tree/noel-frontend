import ResetPasswordConfirmClientPage from "./ResetPasswordConfirmClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Confirm",
  description: "Confirm password reset using link from email.",
};

export default function ResetPasswordConfirmPage() {
  return <ResetPasswordConfirmClientPage />;
}
