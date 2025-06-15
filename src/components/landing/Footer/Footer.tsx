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
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#" },
      { label: "Mobile Apps", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Gift Ideas", href: "#" },
      { label: "Tutorials", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
];

export const SiteFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.logoColumn}>
          <Link href="/" className={styles.logo}>
            <Gift size={32} />
            <span>Noel</span>
          </Link>
          <p>Making holiday gift exchanges magical.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Facebook">
              <FaFacebookF size={20} />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter size={20} />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram size={20} />
            </a>
            <a href="#" aria-label="Pinterest">
              <FaPinterest size={20} />
            </a>
          </div>
        </div>
        {footerLinks.map((column) => (
          <div key={column.title}>
            <h3 className={styles.columnTitle}>{column.title}</h3>
            <ul className={styles.linkList}>
              {column.links.map((link) => (
                <li key={link.label} className={styles.link}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.subFooter}>
        <p>&copy; {new Date().getFullYear()} Noel. All rights reserved.</p>
        <div className={styles.socials} style={{ marginTop: 0 }}>
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
        </div>
      </div>
    </footer>
  );
};
