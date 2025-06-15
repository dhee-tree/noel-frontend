import React from "react";
import styles from "./Testimonials.module.css";
import { User, Star } from "lucide-react";

const testimonialsData = [
  {
    name: "Sarah J.",
    quote:
      "Noel saved our family Christmas! With 15 cousins, organizing Secret Santa was always chaotic. This year it took 5 minutes and the wishlist feature was a game-changer!",
    rating: 5,
    avatarColor: "var(--primary-color)",
  },
  {
    name: "Michael T.",
    quote:
      "As the designated organizer for our office Secret Santa, I dreaded it every year. Noel made it so easy! The automated reminders meant everyone actually participated.",
    rating: 5,
    avatarColor: "var(--secondary-color)",
  },
  {
    name: "Emma & David",
    quote:
      "We used Noel for our long-distance friend group across 4 time zones. The mobile experience was flawless, and it kept the secret perfectly. Highly recommended!",
    rating: 5,
    avatarColor: "var(--accent-green)",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>What People Are Saying</h2>
        <p className={styles.subtitle}>
          Don&apos;t just take our word for it. Here&apos;s what our users say about Noel.
        </p>

        <div className={styles.grid}>
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.avatar}
                  style={{ backgroundColor: `${testimonial.avatarColor}1A` }}
                >
                  <User size={28} style={{ color: testimonial.avatarColor }} />
                </div>
                <div className={styles.authorInfo}>
                  <h3 className={styles.name}>{testimonial.name}</h3>
                  <div className={styles.rating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < testimonial.rating
                            ? styles.starFilled
                            : styles.starEmpty
                        }
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className={styles.quote}><q>{testimonial.quote}</q></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
