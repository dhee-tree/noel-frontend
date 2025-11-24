"use client";
import React from "react";
import Link from "next/link";
import {
  FaCookieBite,
  FaShieldAlt,
  FaChartBar,
  FaBullhorn,
} from "react-icons/fa";
import styles from "./CookiesPage.module.css";

export default function CookieClientPage() {
  const lastUpdated = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cookie Policy</h1>
        <span className={styles.lastUpdated}>Last Updated: {lastUpdated}</span>
      </header>

      <div className={styles.content}>
        <p className="mb-5 lead text-center">
          Cookies aren&apos;t just for Santa! At <strong>NOEL</strong>, we use
          digital cookies to make our website run smoothly, keep your account
          secure, and help us understand how to make your Secret Santa
          experience even better.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FaCookieBite className={styles.sectionIcon} /> What are Cookies?
          </h2>
          <p>
            Cookies are small text files that are placed on your computer or
            mobile device when you visit a website. They are widely used to make
            websites work more efficiently and to provide information to the
            owners of the site.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FaShieldAlt className={styles.sectionIcon} /> 1. Strictly Necessary
            Cookies
          </h2>
          <p className="mb-3">
            These cookies are essential for you to browse the website and use
            its features. Without these, services like logging in or saving your
            privacy preferences cannot be provided.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>Cookie Preferences (noel_cookie_consent):</strong>
              We use this cookie to remember your choices about which cookies
              you allow, so we don&apos;t have to ask you every time you visit a
              new page.
            </li>
            <li className={styles.listItem}>
              <strong>Authentication (Next-Auth):</strong>
              We use these to identify you when you log in so you don&apos;t
              have to keep entering your password on every page.
            </li>
            <li className={styles.listItem}>
              <strong>Security (Cloudflare):</strong>
              We use Cloudflare to protect our website from bots and malicious
              attacks. They may set a cookie to verify you are a real human.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FaChartBar className={styles.sectionIcon} /> 2. Analytics &
            Performance
          </h2>
          <p className="mb-3">
            These cookies collect information about how you use our website, for
            instance, which pages you go to most often. This data is aggregated
            and anonymous.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>Google Analytics:</strong>
              We use this to understand how people find Noel and where they
              might be getting stuck. This helps us improve the app for
              everyone.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FaBullhorn className={styles.sectionIcon} /> 3. Marketing Cookies
          </h2>
          <p className="mb-3">
            These cookies are used to track visitors across websites. The
            intention is to display ads that are relevant and engaging for the
            individual user.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>Google Ads:</strong>
              Since you may have found us through a Google search, Google uses
              cookies to help us measure the effectiveness of our advertising
              campaigns.
            </li>
            <li className={styles.listItem}>
              <strong>Affiliate Cookies:</strong> When you click on a gift link
              that takes you to a retailer (like Amazon), a cookie may be placed
              on your device to track the referral. This allows the retailer to
              know that you came from Noel, which may result in us earning a
              small commission.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How to Manage Cookies</h2>
          <p>
            You can change your preferences at any time by clicking &quot;Manage
            Cookies&quot; in the footer of our website. Additionally, most web
            browsers allow control of cookies through settings. To find out
            more, visit{" "}
            <Link
              href="https://www.aboutcookies.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              www.aboutcookies.org
            </Link>
            .
          </p>
        </section>

        <div className="text-center mt-5 pt-4 border-top">
          <p>
            If you have any questions about our use of cookies, please{" "}
            <Link href="/contact" className={styles.link}>
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
