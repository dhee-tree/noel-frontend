import type { Metadata } from "next";
import RegisterClientPage from "@/app/(public)/register/RegisterClientPage";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your Secret Santa account.",
};

export default function RegisterPage() {
  return <RegisterClientPage />;
}
