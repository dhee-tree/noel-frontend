"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { Button } from "@/components/ui/Button/Button";
import styles from "./Hero.module.css";

export const Hero = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Secret Santa Made <br />
            <span className={styles.highlight}>Magical</span>
          </h1>

          <p className={styles.subtitle}>
            Noel makes organising your gift exchange effortless, fun, and full
            of cheer. Create your group, set rules, and let our algorithm handle
            the rest!
          </p>

          <div className={styles.actions}>
            <button
              className={styles.googleButton}
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Spinner animation="border" size="sm" variant="dark" />
              ) : (
                <FcGoogle size={24} />
              )}
              <span>Continue with Google</span>
            </button>

            <Button href="/register" className={styles.emailButton}>
              <div className={styles.snowflake}>❅</div>
              <span className={styles.emailText}>Sign up with Email</span>
            </Button>
          </div>

          <div className={styles.socialProof}>
            <div className={styles.avatarGroup}>
              <div className={styles.avatar} style={{ background: "#feb2b2" }}>
                J
              </div>
              <div className={styles.avatar} style={{ background: "#9ae6b4" }}>
                S
              </div>
              <div className={styles.avatar} style={{ background: "#90cdf4" }}>
                M
              </div>
              <div className={styles.avatar} style={{ background: "#faf089" }}>
                A
              </div>
            </div>
            <div className={styles.proofText}>
              Join in spreading holiday joy!
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <Image
            src="/images/svg/wrapped.svg"
            alt="Secret Santa Illustration"
            width={500}
            height={500}
            priority
            className={styles.heroImage}
          />
        </div>
      </div>

      {/* The Snow Wave Divider */}
      <div className={styles.waveDivider}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={styles.shapeFill}
          />
        </svg>
      </div>
    </section>
  );
};
