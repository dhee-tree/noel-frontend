"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import styles from "./CookieConsent.module.css";
import { FaCookieBite } from "react-icons/fa";

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Default State
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const cookieValue = getCookie("noel_cookie_consent");

    if (!cookieValue) {
      // No cookie? Show banner after small delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Cookie found? Load settings and run Google Consent
      try {
        const prefs = JSON.parse(cookieValue);
        setPreferences(prefs);
        updateGoogleConsent(prefs);
      } catch (error) {
        // If cookie is corrupted, reset
        console.error("Error parsing cookie consent:", error);
        setCookie("noel_cookie_consent", "", -1);
        setShowBanner(true);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const openSettings = () => setShowSettings(true);

    window.addEventListener("open-cookie-settings", openSettings);

    return () =>
      window.removeEventListener("open-cookie-settings", openSettings);
  }, []);

  const updateGoogleConsent = (prefs: typeof preferences) => {
    if (typeof window !== "undefined") {
      const gtag = (
        window as unknown as { gtag?: (...args: unknown[]) => void }
      ).gtag;
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          analytics_storage: prefs.analytics ? "granted" : "denied",
          ad_storage: prefs.marketing ? "granted" : "denied",
          ad_user_data: prefs.marketing ? "granted" : "denied",
          ad_personalization: prefs.marketing ? "granted" : "denied",
        });
      }
    }
  };

  const savePreferences = (newPrefs: typeof preferences) => {
    setCookie("noel_cookie_consent", JSON.stringify(newPrefs), 365);
    updateGoogleConsent(newPrefs);
    setPreferences(newPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allGranted = { necessary: true, analytics: true, marketing: true };
    savePreferences(allGranted);
  };

  const handleRejectAll = () => {
    const allDenied = { necessary: true, analytics: false, marketing: false };
    savePreferences(allDenied);
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* --- BANNER --- */}
      {showBanner && !showSettings && (
        <div className={styles.banner}>
          <div className={styles.content}>
            <div className={styles.text}>
              <div className={styles.title}>
                <FaCookieBite /> We value your privacy
              </div>
              <p>
                We use cookies to enhance your experience, analyse site traffic,
                and deliver personalised content.
              </p>
            </div>
            <div className={styles.actions}>
              <button
                onClick={() => setShowSettings(true)}
                className={styles.manageBtn}
              >
                Manage Preferences
              </button>
              <button onClick={handleRejectAll} className={styles.rejectBtn}>
                Reject Non-Essential
              </button>
              <button onClick={handleAcceptAll} className={styles.acceptBtn}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal show={showSettings} onHide={() => setShowSettings(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cookie Preferences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-4">
            Manage your consent preferences. Necessary cookies are always on.
          </p>

          <Form>
            <div className={styles.switchRow}>
              <div>
                <strong>Strictly Necessary</strong>
                <div className="text-muted small">
                  Login, Security, Core features
                </div>
              </div>
              <Form.Check type="switch" checked={true} disabled />
            </div>

            <div className={styles.switchRow}>
              <div>
                <strong>Analytics & Performance</strong>
                <div className="text-muted small">Google Analytics</div>
              </div>
              <Form.Check
                type="switch"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    analytics: e.target.checked,
                  })
                }
              />
            </div>

            <div className={styles.switchRow}>
              <div>
                <strong>Marketing</strong>
                <div className="text-muted small">
                  Google Ads & Personalisation
                </div>
              </div>
              <Form.Check
                type="switch"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    marketing: e.target.checked,
                  })
                }
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleRejectAll}>
            Reject All
          </Button>
          <Button
            onClick={handleSaveSettings}
            style={{ background: "#c62828", border: "none", color: "white" }}
          >
            Save Preferences
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
