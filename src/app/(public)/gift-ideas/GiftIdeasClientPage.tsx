"use client";
import React, { useState } from "react";
import { Container, Card, Badge } from "react-bootstrap";
import { FaExternalLinkAlt, FaGift } from "react-icons/fa";
import styles from "./GiftIdeas.module.css";

const AMAZON_TAG = "noelsecretsan-21";

const GIFT_CATEGORIES = [
  { id: "all", label: "All Ideas" },
  { id: "budget", label: "Under £10" },
  { id: "office", label: "For Coworkers" },
  { id: "funny", label: "Funny / Gag" },
  { id: "cozy", label: "Cozy & Warm" },
  { id: "tech", label: "Tech Gadgets" },
];

const GIFT_IDEAS = [
  {
    title: "Desktop Vacuum Cleaner",
    price: "£12.99",
    category: "office",
    description:
      "A tiny, battery-powered vacuum for crumbs. Oddly satisfying and actually useful.",
    link: "https://www.amazon.co.uk/s?k=desktop+vacuum",
    tags: ["Office", "Funny"],
  },
  {
    title: "Succulent Plant Pot Set",
    price: "£15.00",
    category: "cozy",
    description:
      "Hard to kill, look great on a desk. Perfect for the person you don't know very well.",
    link: "https://www.amazon.co.uk/s?k=succulent+pots",
    tags: ["Decor", "Safe Bet"],
  },
  {
    title: "Gourmet Hot Sauce Trio",
    price: "£9.99",
    category: "budget",
    description:
      "For the spice lover in the group. Usually comes in a nice gift box.",
    link: "https://www.amazon.co.uk/s?k=hot+sauce+gift+set",
    tags: ["Food", "Budget"],
  },
  {
    title: "Cable Organiser Clips",
    price: "£6.99",
    category: "tech",
    description:
      "Simple, cheap, and genuinely useful for anyone with a messy desk.",
    link: "https://www.amazon.co.uk/s?k=cable+clips",
    tags: ["Tech", "Practical"],
  },
  {
    title: "1000 Piece Puzzle",
    price: "£14.00",
    category: "cozy",
    description:
      "Great for the holidays when everyone is stuck inside avoiding the cold.",
    link: "https://www.amazon.co.uk/s?k=1000+piece+puzzle",
    tags: ["Hobby", "Relaxing"],
  },
  {
    title: "The 'Book of Useless Information'",
    price: "£8.50",
    category: "funny",
    description:
      "The perfect toilet read. Full of random facts nobody needs to know.",
    link: "https://www.amazon.co.uk/s?k=book+of+useless+information",
    tags: ["Book", "Funny"],
  },
  {
    title: "Reusable Coffee Cup",
    price: "£11.00",
    category: "office",
    description: "Eco-friendly and stylish. A safe bet for almost anyone.",
    link: "https://www.amazon.co.uk/s?k=reusable+coffee+cup",
    tags: ["Eco", "Drink"],
  },
  {
    title: "Smartphone Camera Lens Kit",
    price: "£18.00",
    category: "tech",
    description:
      "Clip-on lenses (fisheye, macro) for mobile phones. Fun for parties.",
    link: "https://www.amazon.co.uk/s?k=phone+lens+kit",
    tags: ["Tech", "Photography"],
  },
];

export default function GiftIdeasClientPage() {
  const [filter, setFilter] = useState("all");

  const getAffiliateLink = (url: string) => {
    try {
      const link = new URL(url);
      link.searchParams.set("tag", AMAZON_TAG);
      return link.toString();
    } catch (error) {
      console.error("Invalid URL:", url, error);
      return url;
    }
  };

  const filteredGifts =
    filter === "all"
      ? GIFT_IDEAS
      : GIFT_IDEAS.filter(
          (g) =>
            g.category === filter ||
            g.tags.map((t) => t.toLowerCase()).includes(filter)
        );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.hero}>
        <Container>
          <h1 className={styles.title}>Gift Inspiration</h1>
          <p className={styles.subtitle}>
            Stuck on what to buy? Browse our curated list of Secret Santa
            favorites that fit almost any budget.
          </p>
        </Container>
      </div>

      <Container className={styles.container}>
        <div className={styles.filterBar}>
          {GIFT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`${styles.filterChip} ${
                filter === cat.id ? styles.activeChip : ""
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {filteredGifts.map((gift, index) => (
            <Card key={index} className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.giftTitle}>{gift.title}</h3>
                  <span className={styles.priceTag}>{gift.price}</span>
                </div>

                <div className={styles.tags}>
                  {gift.tags.map((tag) => (
                    <Badge
                      key={tag}
                      bg="light"
                      text="dark"
                      className="me-1 fw-normal border"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className={styles.description}>{gift.description}</p>

                <a
                  href={getAffiliateLink(gift.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.buyLink}
                >
                  Search this Item <FaExternalLinkAlt size={12} />
                </a>
              </div>
            </Card>
          ))}
        </div>

        {filteredGifts.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted">
              <FaGift size={48} className="mb-3 opacity-50" />
              <p>No gifts found in this category yet!</p>
            </div>
          </div>
        )}

        <div className={styles.disclaimer}>
          <small>
            Note: Links direct to external search results. Prices are estimates
            and subject to change. As an Amazon Associate, Noel may earn from
            qualifying purchases.
          </small>
        </div>
      </Container>
    </div>
  );
}
