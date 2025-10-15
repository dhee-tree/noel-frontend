"use client";
import React, { useState } from "react";
import { FaqItem } from "@/components/landing/Faq/FaqItem";
import styles from "./Faq.module.css";

const faqData = [
  {
    question: "Is Noel really free to use?",
    answer:
      "Yes! Noel is completely free for basic Secret Santa exchanges. We may offer premium features in the future, but the core functionality will always be free.",
  },
  {
    question: "Can I set rules like 'no spouse exchanges'?",
    answer:
      "Absolutely! When setting up your exchange, you can add restrictions to prevent certain people from being matched together. Our algorithm will respect all your rules.",
  },
  {
    question: "What if someone doesn't buy a gift?",
    answer:
      "Noel sends automated reminders as your exchange date approaches. If someone still doesn't participate, the organizer can easily reassign their recipient.",
  },
  {
    question: "Can we do a virtual gift exchange?",
    answer:
      "Yes! Many groups use Noel for digital gift exchanges like e-gift cards or subscriptions. You can specify this in your exchange settings.",
  },
];

export const Faq = () => {
  // State to track which accordion item is open. null means all are closed.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Frequently Asked Questions</h2>
        <p className={styles.subtitle}>
          Got questions? We&apos;ve got answers.
        </p>
        <div className={styles.accordion}>
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
