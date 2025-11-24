"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, Menu, X } from "lucide-react";
import styles from "./SiteHeader.module.css";
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
  const pathname = usePathname();

  // Prevent body scroll when mobile menu is open
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
          {pathname === "/" && (
            <Button href="/login" variant="primaryOutline">
              Login
            </Button>
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
            <span className={styles.logo} style={{ fontSize: "1.75rem" }}>
              NOEL
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className={styles.closeButton}
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
                onClick={() => setIsMobileMenuOpen(false)}
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
