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
    links: [
      { label: "Gift Ideas", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

export const SiteFooter = () => {
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
            <a href="#" aria-label="Facebook" className={styles.socialLink}>
              <FaFacebookF size={16} />
            </a>
            <a href="#" aria-label="Twitter" className={styles.socialLink}>
              <FaTwitter size={16} />
            </a>
            <a href="#" aria-label="Instagram" className={styles.socialLink}>
              <FaInstagram size={16} />
            </a>
            <a href="#" aria-label="Pinterest" className={styles.socialLink}>
              <FaPinterest size={16} />
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
          <Link href="#" className={styles.legalLink}>
            Privacy Policy
          </Link>
          <Link href="#" className={styles.legalLink}>
            Terms of Service
          </Link>
          <Link href="#" className={styles.legalLink}>
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};
