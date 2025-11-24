import React from "react";
import { Button } from "@/components/ui/Button/Button";
import styles from "./Cta.module.css";
import { FaSleigh } from "react-icons/fa";

export const Cta = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Ready to Start the Tradition?</h2>
        <p className={styles.subtitle}>
          No spreadsheets, no lost emails, just holiday magic. Join thousands of
          happy families and friends using Noel today.
        </p>

        <div className={styles.buttonWrapper}>
          <Button href="/register" className={styles.ctaButton}>
            Start Your Exchange Free <FaSleigh style={{ marginLeft: "10px" }} />
          </Button>
        </div>
      </div>
    </section>
  );
};
