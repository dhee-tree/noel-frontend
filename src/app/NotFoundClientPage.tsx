"use client";
import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import Image from "next/image";
import styles from "./NotFound.module.css";

export default function NotFoundClientPage() {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [isExploding, setIsExploding] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleBoxClick = () => {
    if (isExploding) return;
    
    setIsShaking(true);
    
    // Short delay for shake animation before confetti
    setTimeout(() => {
      setIsShaking(false);
      setIsExploding(true);
      
      // Stop confetti after a few seconds
      setTimeout(() => {
        setIsExploding(false);
      }, 4000);
    }, 400);
  };

  return (
    <div className={styles.pageWrapper}>
      {isExploding && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          colors={['#c62828', '#166534', '#fbbf24', '#ffffff']}
        />
      )}

      <Container className={styles.container}>
        <div className={styles.content}>
          
          {/* The 404 Visual */}
          <div className={styles.errorCode}>
            <span>4</span>
            
            {/* Interactive Gift Box as the '0' */}
            <div 
              className={`${styles.giftWrapper} ${isShaking ? styles.shake : ''}`}
              onClick={handleBoxClick}
              role="button"
              tabIndex={0}
              aria-label="Click for a surprise"
            >
              <Image 
                src="/images/svg/gift.svg" 
                alt="0" 
                width={120} 
                height={120}
                className={styles.giftIcon}
              />
              <div className={styles.clickHint}>Tap me!</div>
            </div>
            
            <span>4</span>
          </div>

          <h1 className={styles.title}>Oh snow! It&apos;s a 404.</h1>
          
          <p className={styles.description}>
            Looks like this page got lost in the holiday mail. 
            We&apos;ve checked the sleigh, the workshop, and even the naughty list, 
            but we can&apos;t find what you&apos;re looking for.
          </p>

          <div className={styles.actions}>
            <Button 
              variant="dark" 
              size="lg" 
              className={styles.homeBtn}
              onClick={() => router.push("/")}
            >
              <FaHome className="me-2" /> Return Home
            </Button>
            
            <Button 
              variant="outline-secondary" 
              size="lg" 
              className={styles.backBtn}
              onClick={() => router.back()}
            >
              <FaArrowLeft className="me-2" /> Go Back
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}