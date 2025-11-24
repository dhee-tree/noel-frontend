"use client";
import React from "react";
import Link from "next/link";
import {
  FaGlobeAmericas,
  FaMagic,
  FaUserSecret,
  FaHeart,
  FaCalendarAlt,
  FaSmileBeam,
  FaGift,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import styles from "./AboutPage.module.css";

export default function AboutClientPage() {
  const features = [
    {
      icon: <FaGlobeAmericas />,
      title: "Global Connectivity",
      desc: "NOEL brings families and friends together from every corner of the globe. Whether you're separated by oceans or just a few city blocks, our platform ensures everyone can join in on the festive fun.",
    },
    {
      icon: <FaMagic />,
      title: "Seamless Experience",
      desc: "Our user-friendly interface makes navigating the Secret Santa process a joy. From creating a group to receiving and sending gifts, NOEL streamlines the experience so you can focus on giving.",
    },
    {
      icon: <FaUserSecret />,
      title: "Safe & Secure",
      desc: "Our platform is built on a foundation of trust. We prioritise privacy and confidentiality, ensuring that the excitement of discovering your Secret Santa's identity remains a cherished surprise.",
    },
    {
      icon: <FaHeart />,
      title: "Unforgettable Moments",
      desc: "We believe that the joy of giving is a gift in itself. NOEL is dedicated to creating unforgettable moments for you and your loved ones, making the experience as magical as possible.",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Year-Round Festivity",
      desc: "Who says the joy of giving should be limited to December? Organise exchanges for birthdays, anniversaries, or any special occasion, spreading love and cheer throughout the year.",
    },
    {
      icon: <FaSmileBeam />,
      title: "Completely Free",
      desc: "We believe that the joy of giving should be accessible to everyone. That's why NOEL is completely free to use for groups of all sizes.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Where the Magic of Secret Santa <br />
          <span className={styles.highlight}>Knows No Boundaries</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Say goodbye to geographical constraints and hello to the magic of
          Secret Santa, reimagined for the modern era.
        </p>
      </section>

      {/* Story & Mission Grid */}
      <section className={styles.storyGrid}>
        <div className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <p className={styles.text}>
            NOEL was born out of a desire to bring families together during the
            holiday season. We understand that the festive period is a time for
            family and friends, and we wanted to create a platform that would
            allow loved ones to connect, no matter where they are in the world.
          </p>
        </div>
        <div className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.text}>
            At the heart of NOEL is a simple yet powerful mission to connect
            loved ones through the joy of giving. We understand that distance
            should never be a barrier to the festive spirit, which is why we
            crafted a seamless experience that transcends borders.
          </p>
        </div>
      </section>

      {/* Why Choose Noel (Features) */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose NOEL?</h2>
          <p className="text-muted">
            Your passport to festive fun and effortless organisation.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.iconWrapper}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureText}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community / CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Join the NOEL Family</h2>
        <p className={styles.ctaText}>
          NOEL is more than just a platform, it&apos;s a community. Whether you&apos;re
          separated by miles or just around the corner, let us be the bridge
          that brings your loved ones closer.
        </p>

        <div className={styles.ctaButtons}>
          <Link href="/register" className={styles.primaryButton}>
            <FaGift className="me-2" /> Start an Exchange
          </Link>
          <Link
            href="mailto:support@noelsecretsanta.com"
            className={styles.secondaryButton}
          >
            <FaEnvelopeOpenText className="me-2" /> Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
