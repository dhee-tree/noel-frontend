"use client";
import React from "react";
import type { Session } from "next-auth";
import Image from "next/image";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import {
  FaGift,
  FaUsers,
  FaStar,
  FaPlus,
  FaCalendarAlt,
  FaCopy,
} from "react-icons/fa";
import {
  VerifyEmailModal,
  JoinGroupModal,
  CreateGroupModal,
} from "@/components/modals";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserGroups } from "@/hooks/useUserGroups";
import { toast } from "react-toastify";
import styles from "./DashboardClientPage.module.css";

export default function DashboardClientPage({ session }: { session: Session }) {
  // SWR hooks for data fetching
  const { user, isLoading: userLoading } = useCurrentUser();
  const { groups, isLoading: loadingGroups } = useUserGroups();

  const displayName =
    user?.first_name ??
    user?.last_name ??
    session?.user?.firstName ??
    session?.user?.lastName ??
    session?.user?.email?.split?.("@")?.[0] ??
    "Friend";

  const handleCopyCode = (code: string | undefined) => {
    if (code) {
      navigator.clipboard?.writeText(code);
      toast.success("Group code copied!");
    } else {
      toast.error("No code to copy");
    }
  };

  // Calculate days until Christmas
  const getDaysUntilChristmas = (): number => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const christmas = new Date(currentYear, 11, 25); // December 25

    if (today > christmas) {
      christmas.setFullYear(currentYear + 1);
    }

    const diffTime = christmas.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilChristmas();

  const renderGroupSkeleton = (key: number) => (
    <Col xs={12} sm={6} md={4} key={`skeleton-${key}`}>
      <Card className="mb-3 shadow-sm" role="status" aria-hidden>
        <Card.Body>
          <div className="placeholder-glow">
            <span className="placeholder col-7 mb-2" />
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="placeholder col-4" />
              <span className="placeholder col-3" />
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container className={styles.dashboardContainer}>
      {/* Hero Section */}
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card className={styles.noelHero}>
            <Card.Body>
              <div className={styles.heroWrapper}>
                <Image
                  src="/images/svg/santa.svg"
                  alt="Santa"
                  width={120}
                  height={120}
                  className={styles.floatingSanta}
                  priority
                />
                <div className={styles.heroContent}>
                  <h2 className={styles.heroTitle}>
                    Hey {displayName} — welcome back!
                  </h2>
                  <p className={styles.heroSubtitle}>
                    Your festive hub: manage groups, wishlists and surprises —
                    all in one place.
                  </p>

                  <div className={styles.heroButtons}>
                    <CreateGroupModal
                      trigger={{
                        type: "button",
                        label: "Create Group",
                        icon: <FaPlus />,
                        variant: "light",
                        size: "sm",
                      }}
                    />
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => (location.href = "/groups")}
                    >
                      <FaUsers />{" "}
                      <span className="d-none d-sm-inline ms-1">My Groups</span>
                    </Button>
                    <JoinGroupModal
                      trigger={{
                        type: "button",
                        label: "Join Group",
                        icon: <FaGift />,
                        variant: "outline-light",
                        size: "sm",
                      }}
                    />
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => (location.href = "/wishlist")}
                    >
                      <FaStar />{" "}
                      <span className="d-none d-sm-inline ms-1">
                        My Wishlist
                      </span>
                    </Button>
                  </div>
                </div>

                <div className={styles.heroMeta}>
                  <Badge pill className={styles.accentBadge}>
                    <FaCalendarAlt className="me-1" />
                    {daysLeft} {daysLeft === 1 ? "Day" : "Days"} to Christmas
                  </Badge>
                  {groups && groups.length > 0 && (
                    <Badge
                      pill
                      className={`${styles.accentBadge} ${styles.groupsBadge} mt-2`}
                    >
                      <FaUsers className="me-1" />
                      {groups.length} Active{" "}
                      {groups.length === 1 ? "Group" : "Groups"}
                    </Badge>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Groups Section */}
      <Row className="justify-content-center mt-4">
        <Col xs={12}>
          <div className={styles.sectionHeader}>
            <h4>Your Groups</h4>
            <small className="text-muted">
              {loadingGroups
                ? "Loading..."
                : groups && groups.length > 0
                ? `${groups.length} group${groups.length > 1 ? "s" : ""}`
                : "No groups yet"}
            </small>
          </div>

          {/* Show verification alert if not verified */}
          {!user?.is_verified && !userLoading && (
            <Alert variant="warning" className="mb-3">
              <strong>Verify your email</strong> to unlock all features.{" "}
              <VerifyEmailModal
                trigger={{
                  type: "link",
                  label: "Verify now",
                  className: "alert-link",
                }}
              />
            </Alert>
          )}

          <Row className="g-3">
            {loadingGroups &&
              Array.from({ length: 3 }).map((_, i) => renderGroupSkeleton(i))}

            {!loadingGroups && (!groups || groups.length === 0) && (
              <Col xs={12}>
                <Card className={styles.emptyState}>
                  <Card.Body className="text-center">
                    <h5 className="mb-2">You&apos;re not in any groups yet</h5>
                    <p className="text-muted mb-3">
                      Create a group, or join one using a code.
                    </p>
                    <div className={styles.emptyStateButtons}>
                      <CreateGroupModal
                        trigger={{
                          type: "button",
                          label: "Create Group",
                          variant: "success",
                        }}
                      />
                      <JoinGroupModal
                        trigger={{
                          type: "button",
                          label: "Join Group",
                          variant: "outline-primary",
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {!loadingGroups &&
              groups &&
              groups.length > 0 &&
              groups.map((g) => (
                <Col xs={12} sm={6} lg={4} key={g.group_id}>
                  <Card className={`${styles.groupCard} h-100`}>
                    <Card.Body className="d-flex flex-column">
                      <div className={styles.groupHeader}>
                        <div>
                          <h5 className={styles.groupName}>{g.group_name}</h5>
                          <small className="text-muted">
                            Members: {g.member_count ?? "—"}
                          </small>
                        </div>
                        <Badge bg={g.is_open ? "success" : "secondary"}>
                          {g.is_open ? "Open" : "Closed"}
                        </Badge>
                      </div>

                      <div className={styles.groupBody}>
                        {g.group_code ? (
                          <div className={styles.codeSection}>
                            <span className="text-muted small">Code:</span>
                            <div className={styles.codeWrapper}>
                              <code className={styles.groupCode}>
                                {g.group_code}
                              </code>
                              <button
                                className={styles.copyIcon}
                                onClick={() => handleCopyCode(g.group_code)}
                                aria-label="Copy code"
                                title="Copy code"
                              >
                                <FaCopy />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted small mb-0">
                            No code available
                          </p>
                        )}
                      </div>

                      <div className={styles.groupFooter}>
                        <Button
                          variant="primary"
                          href={`/group/${g.group_id}`}
                          className={styles.viewButton}
                        >
                          View Group
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
