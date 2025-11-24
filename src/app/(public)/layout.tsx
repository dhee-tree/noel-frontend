import React from "react";
import { SiteHeader } from "@/components/landing/SiteHeader/SiteHeader";
import { Snowfall } from "@/components/landing/Snowfall/Snowfall";
import { SiteFooter } from "@/components/landing/Footer/Footer";
import { ToastContainer } from "react-toastify";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Snowfall />
      <SiteHeader />
      <main style={{ width: "100%", overflow: "hidden" }}>{children}</main>
      <SiteFooter />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
