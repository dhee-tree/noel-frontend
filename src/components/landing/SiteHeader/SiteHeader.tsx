"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, Menu, X } from "lucide-react";
import styles from "./SiteHeader.module.css";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button/Button";
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#testimonials', label: 'Testimonials' },
  { href: '/#faq', label: 'FAQ' },
];

export const SiteHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Gift size={32} />
          <span>Noel</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.authButtons}>
          {status === "loading" || !isMounted ? (
            <div style={{ height: "40px" }} />
          ) : status === "unauthenticated" ? (
            <>
              {(pathname === "/" || pathname === "/login") && (
                <Button href="/register" variant="primary">
                  Register
                </Button>
              )}
              {pathname === "/register" && (
                <Button href="/login" variant="primary">
                  Login
                </Button>
              )}
              {pathname !== "/" && pathname !== "/login" && pathname !== "/register" && (
                <>
                  <Button variant="outline" href="/login">
                    Login
                  </Button>
                  <Button variant="primary" href="/register">
                    Register
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <span>Hi, {session?.user?.firstName?.split(" ")[0]}!</span>{" "}
              <Button
                variant="primary"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={28} color="var(--secondary-color)" />
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`${styles.mobileNavOverlay} ${
            isMobileMenuOpen ? styles.mobileNavOverlayOpen : ""
          }`}
        >
          <div className={styles.mobileNavHeader}>
            <span className={styles.logo} style={{ fontSize: "1.75rem" }}>
              NOEL
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={32} color="var(--secondary-color)" />
            </button>
          </div>
          <nav className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${styles.mobileNavLink}`}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
