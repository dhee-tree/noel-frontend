"use client";
import React from "react";
import { Button } from "@/components/ui/Button/Button";
import { Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import styles from "./Hero.module.css";
import { signIn } from "next-auth/react";

export const Hero = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Secret Santa Made Magical</h1>
        <p className={styles.subtitle}>
          Noel makes organising your Secret Santa gift exchange effortless, fun,
          and full of holiday cheer. Create your group, set preferences, and let
          Noel handle the rest!
        </p>
        <div className={styles.buttonGroup}>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className={styles.googleButton}
          >
            <FcGoogle size={26} />
            <span>Continue with Google</span>
            <Sparkles size={20} className="ml-2 opacity-80" />
          </Button>

          <Button href="/register" className={styles.emailButton}>
            <span className={styles.emailText}>Sign up with Email</span>
            <div className={styles.snowflake}>❅</div>
          </Button>
        </div>
      </div>
    </section>
  );
};
