import React from "react";
import { Button } from "@/components/ui/Button/Button";
import styles from "./Cta.module.css";

export const Cta = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Ready to Make This Christmas Magical?</h2>
        <p className={styles.subtitle}>
          Join thousands of happy families, friends, and coworkers who make
          their holiday celebrations special with Noel.
        </p>
        <div className={styles.buttonGroup}>
          <Button href="#" className={styles.lightButton}>
            Start Your Exchange Free
          </Button>
          <Button
            href="#"
            variant="outline"
            style={{ borderColor: "#fff", color: "#fff" }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};
