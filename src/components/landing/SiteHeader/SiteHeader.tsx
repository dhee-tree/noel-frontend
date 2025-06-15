'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';
import { Gift, Menu, X } from 'lucide-react';
import styles from './SiteHeader.module.css';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
];

export const SiteHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Gift size={32} />
          <span>Noel</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={28} color="var(--secondary-color)" />
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`${styles.mobileNavOverlay} ${isMobileMenuOpen ? styles.mobileNavOverlayOpen : ''}`}
        >
          <div className={styles.mobileNavHeader}>
             <span className={styles.logo} style={{fontSize: "1.75rem"}}>NOEL</span>
             <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close navigation menu">
                <X size={32} color="var(--secondary-color)" />
             </button>
          </div>
          <nav className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className={`${styles.navLink} ${styles.mobileNavLink}`}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};