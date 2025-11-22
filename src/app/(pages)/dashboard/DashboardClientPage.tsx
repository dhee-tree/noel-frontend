"use client";
import React, { useMemo } from "react";
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
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  VerifyEmailModal,
  JoinGroupModal,
  CreateGroupModal,
} from "@/components/modals";
import { useCurrentUser, useUserGroups } from "@/hooks";
import { toast } from "react-toastify";
import styles from "./DashboardClientPage.module.css";
import { InfoTooltip } from "@/components/ui";

export default function DashboardClientPage({ session }: { session: Session }) {
  // SWR hooks for data fetching
  const { user, isLoading: userLoading } = useCurrentUser();
  const { activeGroups, isLoading: loadingGroups } = useUserGroups();

  const groups = activeGroups;

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

  // Calculate dashboard stats
  const stats = useMemo(() => {
    if (!groups) return null;

    const totalGroups = groups.length;
    const activeGroups = groups.filter((g) => g.is_open).length;
    const totalMembers = groups.reduce(
      (sum, g) => sum + (g.member_count || 0),
      0
    );
    const groupsCreated = groups.filter(
      (g) => g.created_by_id === user?.id
    ).length;

    return {
      totalGroups,
      activeGroups,
      totalMembers,
      groupsCreated,
    };
  }, [groups, user?.id]);

  // Format date helper
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  // Get theme emoji
  const getThemeEmoji = (theme?: string): string => {
    const themeMap: Record<string, string> = {
      christmas: "🎄",
      hanukkah: "🕎",
      kwanzaa: "🕯️",
      winter: "❄️",
      office: "💼",
      family: "👨‍👩‍👧‍👦",
      friends: "👥",
      general: "🎁",
    };
    return themeMap[theme || "general"] || "🎁";
  };

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
                    Ready to spread some holiday cheer?
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
                      <FaUsers /> <span>My Groups</span>
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
                      <FaStar /> <span>My Wishlist</span>
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

      {/* Stats Cards */}
      {stats && stats.totalGroups > 0 && (
        <Row className="justify-content-center mt-4">
          <Col xs={12}>
            <Row className="g-3">
              <Col xs={6} md={3}>
                <Card className={styles.statCard}>
                  <Card.Body className="text-center">
                    <FaUsers className={styles.statIcon} />
                    <h3 className={styles.statNumber}>{stats.totalGroups}</h3>
                    <p className={styles.statLabel}>Total Groups</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className={styles.statCard}>
                  <Card.Body className="text-center">
                    <FaGift className={styles.statIcon} />
                    <h3 className={styles.statNumber}>{stats.activeGroups}</h3>
                    <p className={styles.statLabel}>Open Groups</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className={styles.statCard}>
                  <Card.Body className="text-center">
                    <FaUsers className={styles.statIcon} />
                    <h3 className={styles.statNumber}>{stats.totalMembers}</h3>
                    <p className={styles.statLabel}>Total Members</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className={styles.statCard}>
                  <Card.Body className="text-center">
                    <FaStar className={styles.statIcon} />
                    <h3 className={styles.statNumber}>{stats.groupsCreated}</h3>
                    <p className={styles.statLabel}>Created by You</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}

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
              groups.map((group) => (
                <Col xs={12} sm={6} lg={4} key={group.group_id}>
                  <Card className={`${styles.groupCard} h-100`}>
                    <Card.Body className="d-flex flex-column">
                      <div className={styles.groupHeader}>
                        <div>
                          <h5 className={styles.groupName}>
                            {getThemeEmoji(group.theme)} {group.group_name}
                          </h5>
                          <small className="text-muted">
                            <FaUsers className="me-1" />
                            {group.member_count ?? 0} member
                            {(group.member_count ?? 0) !== 1 ? "s" : ""}
                          </small>
                        </div>
                        <div className="d-flex flex-column gap-1 align-items-end">
                          <Badge bg={group.is_open ? "success" : "secondary"}>
                            {group.is_open ? "Open" : "Closed"}
                          </Badge>
                          <InfoTooltip
                            content={
                              group.is_open ? (
                                <>
                                  <strong>Open Group:</strong> People can still
                                  join this group. Gift assignments (wraps) are
                                  not yet available.
                                </>
                              ) : (
                                <>
                                  <strong>Closed Group:</strong> No one can join
                                  anymore. You can now open your wrap to see who
                                  you should gift!
                                </>
                              )
                            }
                            placement="top"
                            size="sm"
                          />
                          {group.is_white_elephant && (
                            <Badge bg="warning" className="text-dark">
                              🎲 White Elephant
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className={styles.groupBody}>
                        {/* Budget */}
                        {(group.budget_min || group.budget_max) && (
                          <div className="mb-2">
                            <small className="text-muted d-flex align-items-center">
                              <FaMoneyBillWave className="me-1" />
                              Budget:{" "}
                              {group.budget_min && group.budget_max
                                ? `${group.budget_currency || "£"}${
                                    group.budget_min
                                  } - ${group.budget_currency || "£"}${
                                    group.budget_max
                                  }`
                                : group.budget_min
                                ? `From ${group.budget_currency || "£"}${
                                    group.budget_min
                                  }`
                                : `Up to ${group.budget_currency || "£"}${
                                    group.budget_max
                                  }`}
                            </small>
                          </div>
                        )}

                        {/* Exchange Date */}
                        {group.gift_exchange_deadline && (
                          <div className="mb-2">
                            <small className="text-muted d-flex align-items-center">
                              <FaCalendarAlt className="me-1" />
                              Exchange:{" "}
                              {formatDate(group.gift_exchange_deadline)}
                            </small>
                          </div>
                        )}

                        {/* Location */}
                        {group.exchange_location && (
                          <div className="mb-2">
                            <small className="text-muted d-flex align-items-center">
                              <FaMapMarkerAlt className="me-1" />
                              {group.exchange_location}
                            </small>
                          </div>
                        )}

                        {/* Group Code */}
                        {group.group_code && (
                          <div className={styles.codeSection}>
                            <span className="text-muted small">Code:</span>
                            <div className={styles.codeWrapper}>
                              <code className={styles.groupCode}>
                                {group.group_code}
                              </code>
                              <button
                                className={styles.copyIcon}
                                onClick={() => handleCopyCode(group.group_code)}
                                aria-label="Copy code"
                                title="Copy code"
                              >
                                <FaCopy />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.groupFooter}>
                        <Button
                          variant="primary"
                          href={`/groups/${group.group_id}`}
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
