"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, Menu, X } from "lucide-react";
import styles from "./SiteHeader.module.css";
import { Button } from "@/components/ui/Button/Button";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#testimonials", label: "Stories" },
  { href: "/#faq", label: "FAQ" },
];

export const SiteHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const shouldHideLogin =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/dashboard");

  const headerClass = isScrolled
    ? styles.headerScrolled
    : styles.headerTransparent;

  return (
    <header className={`${styles.header} ${headerClass}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Gift size={28} strokeWidth={2.5} />
          <span className={styles.logoText}>Noel</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          {!shouldHideLogin && (
            <Button href="/login" variant="primaryOutline">
              Log In
            </Button>
          )}
          {!pathname.startsWith("/register") && !shouldHideLogin && (
            <Button href="/register" variant="green">
              Get Started
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={28} />
        </button>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className={styles.mobileNavBackdrop}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
        )}

        {/* Mobile Menu Overlay */}
        <div
          className={`${styles.mobileNavOverlay} ${
            isMobileMenuOpen ? styles.mobileNavOverlayOpen : ""
          }`}
        >
          <div className={styles.mobileNavHeader}>
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={styles.logo}
            >
              <Gift size={28} />
              <span className={styles.logoText}>Noel</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className={styles.closeButton}
            >
              <X size={24} />
            </button>
          </div>

          <nav className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 d-flex flex-column gap-3">
              <Button
                href="/login"
                variant="primaryOutline"
                className="w-100 justify-content-center"
              >
                Log In
              </Button>
              <Button
                href="/register"
                variant="green"
                className="w-100 justify-content-center"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
