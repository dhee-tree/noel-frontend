import React from "react";
import styles from "./HowItWorks.module.css";

const stepsData = [
  {
    title: "Create Your Group",
    description:
      "In less than a minute, give your exchange a name, set a budget, and choose your gift exchange date.",
  },
  {
    title: "Invite Participants",
    description:
      "Invite your friends and family with a simple shareable link and join code. They can join with just one click.",
  },
  {
    title: "Share Wishlists",
    description:
      "Everyone can add gift ideas and preferences to their own private wishlist, visible only to their assigned Santa.",
  },
  {
    title: "Let Noel Assign Santas",
    description:
      "With one click, Noel's magic algorithm randomly and secretly assigns a Secret Santa to every participant when they pick a box.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Four Simple Steps</h2>
        <p className={styles.subtitle}>
          Organizing your Secret Santa has never been this easy.
        </p>
        <div className={styles.stepsContainer}>
          {stepsData.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
