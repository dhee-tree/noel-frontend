"use client";
import React, { useState } from "react";
import { FaqItem } from "@/components/landing/Faq/FaqItem";
import styles from "./Faq.module.css";

const faqData = [
  {
    question: "How does Noel work?",
    answer:
      "NOEL allows you to create a group and invite your family and friends to join. Once everyone has joined, you can close the group which will allow the other members to pick a wrapped gift box. Once anyone picks a gift box they will be assigned a person to buy a gift for. Once everyone has picked a gift box.",
  },
  {
    question: "Is Noel really free to use?",
    answer: "Yes! Noel is completely free for basic Secret Santa exchanges.",
  },
  {
    question: "Can we do a virtual gift exchange?",
    answer:
      "Yes! Many groups use Noel for digital gift exchanges like e-gift cards or subscriptions. You can add links or digital gifts to your wishlist items.",
  },
  {
    question: "How do I create a group?",
    answer:
      "Once you have registered, you can create a group by clicking the create group button. You will then be able to invite your family and friends to join your group.",
  },
  {
    question: "How do I invite people to my group?",
    answer:
      "Once you have created a group, you can invite people to join by clicking the invite button on the group page or copy the group invite code. You then need to share the code with your family and friends to join your group.",
  },
  {
    question: "How do I join a group?",
    answer:
      "You can join a group by clicking the join group button on the group page and entering the group invite code.",
  },
  {
    question: "How do I leave a group?",
    answer:
      "You can leave a group by clicking the leave group button on the group page. This will remove you from the group and any related matches associated with the group.",
  },
  {
    question: "How do I close a group?",
    answer:
      "Once everyone has joined your group, you can close the group by clicking the close group button on the group page. This will allow the other members to pick a wrapped gift box.",
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
