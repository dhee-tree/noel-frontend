"use client";
import React from "react";
import Link from "next/link";
import styles from "./TermsPage.module.css";

export default function TermsClientPage() {
  const lastUpdated = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Terms of Service</h1>
        <span className={styles.lastUpdated}>Last Updated: {lastUpdated}</span>
      </header>

      <div className={styles.content}>
        <p className="mb-5 lead text-center">
          Welcome to <strong>NOEL</strong>, the ultimate Secret Santa platform
          that connects friends and family worldwide. Before you embark on your
          festive journey with us, please take a moment to review the following
          terms and conditions. By using NOEL, you agree to abide by these
          terms, so let&apos;s make sure we&apos;re all on the same sleigh ride!
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>1</span> Acceptance of Terms
          </h2>
          <p>
            By accessing or using the NOEL platform, you acknowledge and agree
            to these Terms of Service. If you do not agree with any part of
            these terms, please refrain from using our services. These terms
            apply to all visitors, users, and others who access or use the
            Service.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>2</span> Eligibility &
            Accounts
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>a. Age Requirement:</strong> NOEL is open to users of all
              ages. However, if you are under the age of 18, you must obtain the
              consent of a legal guardian before using the platform.
            </li>
            <li className={styles.listItem}>
              <strong>b. Account Security:</strong> You are responsible for
              maintaining the confidentiality of your account and password. You
              agree to accept responsibility for all activities that occur under
              your account. You must notify us immediately upon becoming aware
              of any breach of security or unauthorised use of your account.
            </li>
            <li className={styles.listItem}>
              <strong>c. Accurate Information:</strong> When creating an
              account, you agree to provide accurate, complete, and up-to-date
              information. Failure to do so constitutes a breach of the Terms,
              which may result in immediate termination of your account.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>3</span> Secret Santa
            Exchange
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>a. Participation:</strong> NOEL facilitates the exchange
              by matching participants based on their groups. By participating,
              you agree to send a thoughtful and appropriate gift to your
              assigned recipient within the budget and timeline set by your
              group admin.
            </li>
            <li className={styles.listItem}>
              <strong>b. Respect & Conduct:</strong> Participants are expected
              to respect the wishes and preferences of their assigned recipient.
              NOEL is a platform for joy; any form of harassment, bullying, or
              malicious behavior will not be tolerated.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>4</span> User Content
          </h2>
          <p>
            By uploading content to NOEL (such as wishlists, group names, or
            messages), you grant us a non-exclusive, worldwide, royalty-free
            license to use, reproduce, and display the content solely for the
            purpose of facilitating the Secret Santa exchange and operating the
            service. You retain all rights to your content.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>5</span> Third-Party Links &
            Products
          </h2>
          <p>
            External Links & Affiliate Disclosure: Our Service contains links to
            third-party websites (such as Amazon) that are not owned or
            controlled by Noel. Please review their terms and privacy policies
            before engaging with them
          </p>
          <li className={styles.listItem}>
            <strong>a. Affiliate Relationship:</strong> Noel is a participant in
            the Amazon Services LLC Associates Program. We may earn commissions
            on qualifying purchases made through our links.
          </li>
          <li className={styles.listItem}>
            <strong>b. No Responsibility:</strong> We assume no responsibility
            for the content, privacy policies, or practices of any third-party
            websites. You acknowledge that Noel shall not be responsible or
            liable, directly or indirectly, for any damage or loss caused by or
            in connection with the use of any such goods or services available
            on or through any such web sites.
          </li>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>6</span> Prohibited
            Activities
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              You agree not to engage in any illegal, harmful, or abusive
              activities on the NOEL platform.
            </li>
            <li className={styles.listItem}>
              You must not attempt to gain unauthorised access to the Service,
              other user accounts, or computer systems or networks connected to
              the Service.
            </li>
            <li className={styles.listItem}>
              You must not use the platform to spam, phish, or distribute
              malware.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>7</span> Termination
          </h2>
          <p>
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms. Upon termination, your right to
            use the Service will immediately cease.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>8</span> Limitation of
            Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, NOEL shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, including without limitation, loss of profits,
            data, use, goodwill, or other intangible losses, resulting from (i)
            your access to or use of or inability to access or use the Service;
            (ii) any conduct or content of any third party on the Service; or
            (iii) unauthorised access, use, or alteration of your transmissions
            or content.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>9</span> Changes to Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will try to
            provide at least 30 days&apos; notice prior to any new terms taking
            effect. What constitutes a material change will be determined at our
            sole discretion.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>10</span> Contact Us
          </h2>
          <p>
            If you have any questions or concerns regarding these Terms, please{" "}
            <Link href="/contact" className={styles.link}>
              contact us
            </Link>
            .
          </p>
        </section>

        <div className="text-center mt-5 pt-4 border-top">
          <p className="text-muted fst-italic">
            Thank you for choosing NOEL. Let&apos;s make this holiday season and
            every celebration thereafter filled with joy, warmth, and the spirit
            of giving!
          </p>
        </div>
      </div>
    </div>
  );
}
