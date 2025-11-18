"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import {
  FaTree,
  FaUsers,
  FaGift,
  FaStar,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import styles from "./AuthNavbar.module.css";

export const AuthNavbar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = () => {
    const callbackUrl = encodeURIComponent(pathname);
    signOut({ callbackUrl: `/login?callbackUrl=${callbackUrl}` });
  };

  const displayName = session?.user?.firstName
    ? `${session.user.firstName} ${session.user.lastName || ""}`.trim()
    : session?.user?.email || "User";

  const isActive = (path: string) => pathname === path;

  return (
    <Navbar expand="lg" className={styles.navbar}>
      <Container fluid className="px-4">
        {isActive("/dashboard") ? (
          <Navbar.Brand
            className={`${styles.brand}`}
            aria-current="page"
            style={{ cursor: "default" }}
          >
            <FaTree className="me-2" />
            <span style={{ fontFamily: "var(--font-christmas)" }}>Noel</span>
          </Navbar.Brand>
        ) : (
          <Navbar.Brand href="/dashboard" className={styles.brand}>
            <FaTree className="me-2" />
            <span style={{ fontFamily: "var(--font-christmas)" }}>Noel</span>
          </Navbar.Brand>
        )}

        <Navbar.Toggle aria-controls="auth-navbar-nav" />

        <Navbar.Collapse id="auth-navbar-nav">
          <Nav className="me-auto">
            {isActive("/dashboard") ? (
              <Nav.Link
                as="span"
                className={styles.activeLink}
                aria-current="page"
                style={{ cursor: "default" }}
              >
                <FaGift className="me-1" />
                Dashboard
              </Nav.Link>
            ) : (
              <Nav.Link href="/dashboard">
                <FaGift className="me-1" />
                Dashboard
              </Nav.Link>
            )}

            {isActive("/groups") ? (
              <Nav.Link
                as="span"
                className={styles.activeLink}
                aria-current="page"
                style={{ cursor: "default" }}
              >
                <FaUsers className="me-1" />
                Groups
              </Nav.Link>
            ) : (
              <Nav.Link href="/groups">
                <FaUsers className="me-1" />
                Groups
              </Nav.Link>
            )}

            {isActive("/wishlist") || pathname?.startsWith("/wishlist/") ? (
              <Nav.Link
                as="span"
                className={styles.activeLink}
                aria-current="page"
                style={{ cursor: "default" }}
              >
                <FaStar className="me-1" />
                Wishlists
              </Nav.Link>
            ) : (
              <Nav.Link href="/wishlist">
                <FaStar className="me-1" />
                Wishlists
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            <NavDropdown
              title={
                <span>
                  <FaUserCircle className="me-1" />
                  {displayName}
                </span>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item disabled>
                {session?.user?.email}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/profile">
                <FaUser className="me-2" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleSignOut}>
                <FaSignOutAlt className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
