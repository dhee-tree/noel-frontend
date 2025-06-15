"use client";
import React, { useState, useEffect } from "react";
import styles from "./Snowfall.module.css";

interface Snowflake {
  id: number;
  left: number;
  initialTop: number;
  animationDuration: number;
  animationDelay: number;
  fontSize: number;
}

export const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const createSnowflakes = () => {
      const snowflakeCount = 75;
      const newSnowflakes: Snowflake[] = Array.from({
        length: snowflakeCount,
      }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        initialTop: Math.random() * -100,
        animationDuration: Math.random() * 10 + 8,
        animationDelay: Math.random() * 10,
        fontSize: Math.random() * 10 + 6,
      }));
      setSnowflakes(newSnowflakes);
    };

    createSnowflakes();
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className={styles.snowflake}
          style={{
            left: `${flake.left}vw`,
            top: `${flake.initialTop}px`,
            fontSize: `${flake.fontSize}px`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
          }}
        >
          ❄️
        </span>
      ))}
    </div>
  );
};
