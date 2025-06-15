import React from "react";
import { ChevronDown } from "lucide-react";
import styles from "./Faq.module.css";

interface FaqItemProps {
  item: {
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onClick: () => void;
}

export const FaqItem = ({ item, isOpen, onClick }: FaqItemProps) => {
  return (
    <div className={styles.item}>
      <button className={styles.trigger} onClick={onClick}>
        <span>{item.question}</span>
        <ChevronDown
          className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
        />
      </button>
      {isOpen && (
        <div className={styles.content}>
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
};
