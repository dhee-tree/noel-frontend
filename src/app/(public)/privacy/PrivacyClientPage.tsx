"use client";
import React from "react";
import Link from "next/link";
import styles from "./PrivacyPage.module.css";

export default function PrivacyClientPage() {
  const lastUpdated = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <span className={styles.lastUpdated}>Last Updated: {lastUpdated}</span>
      </header>

      <div className={styles.content}>
        <p className="mb-5 lead text-center">
          At <strong>NOEL</strong>, we are committed to protecting your privacy
          and ensuring the security of your personal information. This Privacy
          Policy outlines the practices we follow regarding the collection, use,
          and protection of your data when you interact with our Secret Santa
          platform.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>1</span> Information We
            Collect
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>a. User Information:</strong> When you sign up for NOEL,
              we collect basic information such as your name, email address,
              physical address (optional, for gift shipping), and other details
              necessary for account creation.
            </li>
            <li className={styles.listItem}>
              <strong>b. Group Data:</strong> To facilitate the purpose of the
              platform, we store the names of the groups you create, the rules
              you set (budget, dates), and the wishlist items you add.
            </li>
            <li className={styles.listItem}>
              <strong>c. Usage Data & Cookies:</strong> We use cookies and
              similar technologies to collect information about your activity on
              NOEL. This includes technical data like your IP address, browser
              type, and device information to improve the performance and
              security of our platform.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>2</span> How We Use Your
            Information
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>a. Secret Santa Matching:</strong> Your user information
              and groups are used exclusively to match participants in the
              Secret Santa exchange, ensuring a delightful and personalised
              experience.
            </li>
            <li className={styles.listItem}>
              <strong>b. Communication:</strong> We may use your email address
              to send important updates, assignment notifications, and
              information related to the NOEL platform (e.g., password resets or
              group invites).
            </li>
            <li className={styles.listItem}>
              <strong>c. Improvement of Services:</strong> Anonymous and
              aggregated data may be used to analyse user trends, enhance our
              services, and improve the overall user experience.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>3</span> Data Security
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>a. Encryption:</strong> NOEL employs industry-standard
              encryption protocols (SSL/TLS) to protect your data during
              transmission. Passwords are hashed and salted before storage.
            </li>
            <li className={styles.listItem}>
              <strong>b. Secure Storage:</strong> Your personal information is
              securely stored on our servers (hosted via secure providers), and
              we implement robust measures to prevent unauthorised access.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>4</span> Sharing Your
            Information
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>a. Secret Santa Participants:</strong> Only the necessary
              information required for Secret Santa matching is shared with
              other participants in your specific group (e.g., your wishlist and
              mailing address are visible to the person assigned to gift you).
            </li>
            <li className={styles.listItem}>
              <strong>b. Service Providers:</strong> We may share data with
              trusted third-party service providers who assist us in operating
              our website (e.g., email delivery services, hosting providers, and
              analytics tools). These providers are contractually obligated to
              keep your information confidential.
            </li>
            <li className={styles.listItem}>
              <strong>c. Affiliate Partners:</strong> We participate in
              affiliate advertising programs (such as the Amazon Services LLC
              Associates Program). If you follow a link to a third-party
              retailer, that third party may collect data about your visit to
              attribute the sale to us. We do not share your personal account
              details (name/email) with Amazon.
            </li>
            <li className={styles.listItem}>
              <strong>d. Legal Requirements:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>5</span> Your Rights &
            Choices
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>a. Access & Correction:</strong> You have the right to
              access the personal information we hold about you and to ask that
              your personal information be corrected, updated, or deleted. You
              can manage most of this via your Profile settings.
            </li>
            <li className={styles.listItem}>
              <strong>b. Account Deactivation:</strong> If you choose to
              deactivate your account, your personal information will be
              securely deleted from our live servers within 48 hours.
            </li>
            <li className={styles.listItem}>
              <strong>c. Marketing Communications:</strong> You can opt out of
              marketing emails at any time by clicking the
              &quot;unsubscribe&quot; link in the email footer.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>6</span> Policy Updates
          </h2>
          <p>
            NOEL may update this Privacy Policy periodically to reflect changes
            in our practices. We will notify users of any significant updates
            via email or through a notice on the platform.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>7</span> Contact Us
          </h2>
          <p>
            If you have any questions or concerns regarding your privacy or this
            Privacy Policy, please{" "}
            <Link href="/contact" className={styles.link}>
              contact us
            </Link>
            .
          </p>
        </section>

        <div className="text-center mt-5 pt-4 border-top">
          <p className="text-muted fst-italic">
            Thank you for choosing NOEL. We are dedicated to making your Secret
            Santa experience delightful, secure, and, above all, private.
          </p>
        </div>
      </div>
    </div>
  );
}
