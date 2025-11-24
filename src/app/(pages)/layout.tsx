"use client";
import React from "react";
import { AuthNavbar } from "@/components/navigation/AuthNavbar/AuthNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SiteFooter } from "@/components/landing/Footer/Footer";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AuthNavbar />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter />
      {/* Toast notifications for all authenticated pages */}
      <ToastContainer
        position="bottom-center"
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
