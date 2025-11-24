"use client";
import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import { Gift } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Resources",
    links: [{ label: "Gift Ideas", href: "/gift-ideas" }],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const SiteFooter = () => {
  const openCookieSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-cookie-settings"));
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.logoColumn}>
          <Link href="/" className={styles.logo}>
            <Gift size={28} strokeWidth={2.5} />
            <span className={styles.logoText}>Noel</span>
          </Link>
          <p className={styles.tagline}>
            Making holiday gift exchanges effortless, magical, and fun for
            everyone.
          </p>
          <div className={styles.socials}>
            <Link href="#" aria-label="Facebook" className={styles.socialLink}>
              <FaFacebookF size={16} />
            </Link>
            <Link href="#" aria-label="Twitter" className={styles.socialLink}>
              <FaTwitter size={16} />
            </Link>
            <Link href="#" aria-label="Instagram" className={styles.socialLink}>
              <FaInstagram size={16} />
            </Link>
            <Link href="#" aria-label="Pinterest" className={styles.socialLink}>
              <FaPinterest size={16} />
            </Link>
          </div>
        </div>

        {footerLinks.map((column) => (
          <div key={column.title}>
            <h3 className={styles.columnTitle}>{column.title}</h3>
            <ul className={styles.linkList}>
              {column.links.map((link) => (
                <li key={link.label} className={styles.linkItem}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.subFooter}>
        <p>© {new Date().getFullYear()} Noel. All rights reserved.</p>
        <div className={styles.legalLinks}>
          <Link href="/privacy" className={styles.legalLink}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={styles.legalLink}>
            Terms of Service
          </Link>

          <Link href="/cookies" className={styles.legalLink}>
            Cookie Policy
          </Link>

          <button
            onClick={openCookieSettings}
            className={styles.legalLink}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Manage Cookies
          </button>
        </div>
      </div>
    </footer>
  );
};
