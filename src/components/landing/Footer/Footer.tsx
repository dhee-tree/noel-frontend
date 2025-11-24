"use client";
import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import { Gift } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

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

  const instagramUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
  const facebookUrl =
    process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com";
  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com";

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
            <a
              href={instagramUrl}
              aria-label="Instagram"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href={facebookUrl}
              aria-label="Facebook"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href={twitterUrl}
              aria-label="Twitter"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter size={16} />
            </a>
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
