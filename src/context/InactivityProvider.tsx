"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useSession, signOut } from "next-auth/react";
import { Modal, Button } from "react-bootstrap";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
const WARNING_TIMEOUT = 10 * 1000;

const InactivityContext = createContext({});

export const useInactivity = () => useContext(InactivityContext);

export const InactivityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_TIMEOUT / 1000);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isModalVisibleRef = useRef(false);

  useEffect(() => {
    isModalVisibleRef.current = showModal;
  }, [showModal]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  const clearTimers = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current)
      if (countdownIntervalRef.current) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      }
  }, []);

  const startWarningCountdown = useCallback(() => {
    setShowModal(true);
    setCountdown(WARNING_TIMEOUT / 1000);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleLogout]);

  const startInactivityTimer = useCallback(() => {
    clearTimers();
    inactivityTimerRef.current = setTimeout(
      startWarningCountdown,
      INACTIVITY_TIMEOUT - WARNING_TIMEOUT
    );
  }, [clearTimers, startWarningCountdown]);

  const handleStayLoggedIn = () => {
    setShowModal(false);
    clearTimers();
    startInactivityTimer();
  };

  const handleActivity = useCallback(() => {
    if (isModalVisibleRef.current) {
      return;
    }
    startInactivityTimer();
  }, [startInactivityTimer]);

  useEffect(() => {
    if (status === "authenticated") {
      const events = ["mousemove", "keydown", "click", "scroll"];

      events.forEach((event) => window.addEventListener(event, handleActivity));

      startInactivityTimer();

      return () => {
        events.forEach((event) =>
          window.removeEventListener(event, handleActivity)
        );
        clearTimers();
      };
    } else {
      clearTimers();
      setShowModal(false);
    }
  }, [status, handleActivity, startInactivityTimer, clearTimers]);

  return (
    <InactivityContext.Provider value={{}}>
      {children}
      <Modal
        show={showModal}
        onHide={handleStayLoggedIn}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-danger text-white border-0">
          <Modal.Title style={{ fontFamily: "var(--font-christmas)" }}>
            Are you still there?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You will be logged out due to inactivity in{" "}
          <strong>{countdown}</strong> seconds.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="success" onClick={handleStayLoggedIn}>
            Stay Logged In
          </Button>
        </Modal.Footer>
      </Modal>
    </InactivityContext.Provider>
  );
};
