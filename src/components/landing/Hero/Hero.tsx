"use client";
import React from "react";
import { Button } from "@/components/ui/Button/Button";
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
            variant="green"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FcGoogle size={24} />
            Continue with Google
          </Button>

          <Button variant="primaryOutline" href="/login">
            Continue with Email
          </Button>
        </div>
      </div>
    </section>
  );
};
