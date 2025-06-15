import React from "react";
import styles from "./Features.module.css";
import { Users, Shuffle, Gift, Mail, Lock, Smartphone } from "lucide-react";

const featuresData = [
  {
    icon: Users,
    title: "Easy Group Setup",
    description:
      "Create a group, set your rules, and invite participants with a simple, shareable link. Noel handles the rest.",
    color: "var(--primary-color)",
  },
  {
    icon: Shuffle,
    title: "Smart & Fair Matching",
    description:
      "Our algorithm ensures everyone gets a random, secret match while respecting any exclusions you set (like no spouse exchanges).",
    color: "var(--secondary-color)",
  },
  {
    icon: Gift,
    title: "Wishlist Sharing",
    description:
      "Participants can add their own wishlists to give their Secret Santa a helping hand in finding the perfect gift.",
    color: "var(--accent-green)",
  },
  {
    icon: Mail,
    title: "Automated Reminders",
    description:
      "Noel sends gentle, automated reminders so no one forgets to join the group or add their wishlist on time.",
    color: "var(--accent-color-orange)",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your group's information and assignments are kept secret and secure. We never share your data.",
    color: "#6d28d9",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Organize your gift exchange from any device, anywhere. Noel's experience is seamless on desktop and mobile.",
    color: "#db2777",
  },
];

export const Features = () => {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Why Choose Noel?</h2>
        <p className={styles.subtitle}>
          Everything you need to make your Secret Santa exchange smooth, fun,
          and memorable.
        </p>
        <div className={styles.grid}>
          {featuresData.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div
                className={styles.iconWrapper}
                style={{ backgroundColor: `${feature.color}1A` }} // Adds ~10% opacity
              >
                <feature.icon size={32} style={{ color: feature.color }} />
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
