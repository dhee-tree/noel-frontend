"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  ListGroup,
  Alert,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaEdit,
  FaCopy,
  FaUsers,
  FaCalendar,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaSignOutAlt,
  FaCog,
  FaTrash,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useGroupDetail, useIsGroupOwner, useApiRequest } from "@/hooks";
import { EditGroupModal, ConfirmModal } from "@/components/modals";
import { InfoTooltip } from "@/components/ui";
import { toast } from "react-toastify";
import styles from "./GroupDetailClientPage.module.css";

interface Member {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_wrapped: boolean;
  date_created: string;
}

interface GroupDetailClientPageProps {
  groupId: string;
}

export default function GroupDetailClientPage({
  groupId,
}: GroupDetailClientPageProps) {
  const router = useRouter();
  const { group, isLoading, error, mutateGroup } = useGroupDetail(groupId);
  const { isOwner, isLoading: isOwnerLoading } = useIsGroupOwner(groupId);
  const { apiRequest } = useApiRequest();
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: "leave" | "delete" | "archive" | "toggle-status" | null;
  }>({ show: false, type: null });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleCopyCode = () => {
    if (group?.group_code) {
      navigator.clipboard.writeText(group.group_code);
      toast.success("Group code copied to clipboard!");
    }
  };

  const handleLeaveGroup = () => {
    setConfirmModal({ show: true, type: "leave" });
  };

  const handleDeleteGroup = () => {
    setConfirmModal({ show: true, type: "delete" });
  };

  const handleToggleStatus = () => {
    setConfirmModal({ show: true, type: "toggle-status" });
  };

  const confirmAction = async () => {
    if (!confirmModal.type) return;

    setIsActionLoading(true);
    try {
      let endpoint = "";
      let method: "POST" | "DELETE" = "POST";
      let successMessage = "";
      let shouldRedirect = false;

      switch (confirmModal.type) {
        case "leave":
          endpoint = `/api/groups/${groupId}/leave/`;
          successMessage = "Successfully left the group";
          shouldRedirect = true;
          break;
        case "delete":
          endpoint = `/api/groups/${groupId}/`;
          method = "DELETE";
          successMessage = "Group deleted successfully";
          shouldRedirect = true;
          break;
        case "toggle-status":
          endpoint = `/api/groups/${groupId}/toggle-status/`;
          successMessage = `Group status changed to ${
            group?.is_open ? "Closed" : "Open"
          }`;
          break;
      }

      const response = await apiRequest(endpoint, { method });

      if (!response.ok) {
        if (response.status === 423) {
          toast.error(
            "This group is archived, you cannot perform this action."
          );
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to ${confirmModal.type}`);
      }

      toast.success(successMessage);
      setConfirmModal({ show: false, type: null });

      if (shouldRedirect) {
        router.push("/groups");
      } else {
        await mutateGroup();
      }
    } catch (error) {
      console.error(`${confirmModal.type} error:`, error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${confirmModal.type}`
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const getThemeEmoji = (theme?: string) => {
    const themeMap: Record<string, string> = {
      christmas: "🎄",
      office: "💼",
      family: "👨‍👩‍👧‍👦",
      friends: "🎉",
      gaming: "🎮",
      custom: "✨",
    };
    return theme ? themeMap[theme] || "🎁" : "🎁";
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount?: number | null, currency: string = "USD") => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Container className={styles.container}>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading group details...</p>
        </div>
      </Container>
    );
  }

  if (error || !group) {
    return (
      <Container className={styles.container}>
        <Alert variant="danger">
          <Alert.Heading>Error Loading Group</Alert.Heading>
          <p>
            {error?.message ||
              "Unable to load group details. The group may not exist or you don't have access."}
          </p>
          <Button
            variant="outline-danger"
            onClick={() => router.push("/groups")}
          >
            <FaArrowLeft className="me-2" />
            Back to Groups
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <Row className="mb-4">
        <Col>
          <Button
            variant="link"
            className={styles.backButton}
            onClick={() => router.push("/groups")}
          >
            <FaArrowLeft className="me-2" />
            Back to Groups
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className={styles.headerCard}>
            <Card.Body>
              <div className={styles.headerContent}>
                <div className={styles.titleSection}>
                  <h1 className={styles.groupTitle}>
                    {getThemeEmoji(group.theme)} {group.group_name}
                  </h1>
                  <div className={styles.badges}>
                    <div className="d-flex align-items-center gap-1">
                      <Badge
                        bg={
                          group.is_archived
                            ? "danger"
                            : group.is_open
                            ? "success"
                            : "secondary"
                        }
                      >
                        {group.is_archived
                          ? "Archived"
                          : group.is_open
                          ? "Open"
                          : "Closed"}
                      </Badge>
                      {!group.is_archived && (
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
                          placement="bottom"
                          size="sm"
                        />
                      )}
                    </div>
                    {group.is_white_elephant && (
                      <Badge bg="warning" text="dark">
                        🎲 White Elephant
                      </Badge>
                    )}
                  </div>
                </div>
                {!group.is_archived && (
                  <div className={styles.headerActions}>
                    {isOwner && (
                      <div className="d-flex align-items-center gap-1">
                        <Button
                          variant={
                            group.is_open
                              ? "outline-secondary"
                              : "outline-success"
                          }
                          size="sm"
                          onClick={handleToggleStatus}
                          disabled={isActionLoading}
                          aria-label={
                            group.is_open ? "Close group" : "Open group"
                          }
                          title={group.is_open ? "Close group" : "Open group"}
                        >
                          {group.is_open ? <FaLock /> : <FaUnlock />}
                        </Button>
                      </div>
                    )}
                    {group.group_code && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleCopyCode}
                        aria-label="Copy group code"
                        title="Copy group code"
                      >
                        <FaCopy className="me-2" />
                        {group.group_code}
                      </Button>
                    )}
                    {isOwner && (
                      <EditGroupModal
                        trigger={{
                          type: "button",
                          label: "Edit Group",
                          icon: <FaEdit />,
                          variant: "dark",
                          size: "sm",
                        }}
                        onSuccess={mutateGroup}
                        group={group}
                      />
                    )}
                  </div>
                )}
              </div>
              {group.description && (
                <p className={styles.description}>{group.description}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        {/* Budget Info */}
        {(group.budget_min || group.budget_max) && (
          <Col md={6} lg={3} className="mb-3">
            <Card className={styles.infoCard}>
              <Card.Body>
                <div className={styles.infoIcon}>
                  <FaMoneyBillWave />
                </div>
                <h6 className={styles.infoTitle}>Budget Range</h6>
                <p className={styles.infoValue}>
                  {formatCurrency(group.budget_min, group.budget_currency)} -{" "}
                  {formatCurrency(group.budget_max, group.budget_currency)}
                </p>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Exchange Date */}
        {group.gift_exchange_deadline && (
          <Col md={6} lg={3} className="mb-3">
            <Card className={styles.infoCard}>
              <Card.Body>
                <div className={styles.infoIcon}>
                  <FaCalendar />
                </div>
                <h6 className={styles.infoTitle}>Exchange Date</h6>
                <p className={styles.infoValue}>
                  {formatDate(group.gift_exchange_deadline)}
                </p>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Location */}
        {group.exchange_location && (
          <Col md={6} lg={3} className="mb-3">
            <Card className={styles.infoCard}>
              <Card.Body>
                <div className={styles.infoIcon}>
                  <FaMapMarkerAlt />
                </div>
                <h6 className={styles.infoTitle}>Location</h6>
                <p className={styles.infoValue}>{group.exchange_location}</p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Important Dates */}
      {(group.join_deadline ||
        group.wishlist_deadline ||
        group.assignment_reveal_date) && (
        <Row className="mb-4">
          <Col>
            <Card className={styles.datesCard}>
              <Card.Header>
                <FaCalendar className="me-2" />
                Important Dates
              </Card.Header>
              <Card.Body>
                <Row>
                  {group.join_deadline && (
                    <Col md={4} className="mb-3 mb-md-0">
                      <strong className="d-block text-muted mb-1">
                        Join Deadline
                      </strong>
                      <span>{formatDate(group.join_deadline)}</span>
                    </Col>
                  )}
                  {group.wishlist_deadline && (
                    <Col md={4} className="mb-3 mb-md-0">
                      <strong className="d-block text-muted mb-1">
                        Wishlist Deadline
                      </strong>
                      <span>{formatDate(group.wishlist_deadline)}</span>
                    </Col>
                  )}
                  {group.assignment_reveal_date && (
                    <Col md={4}>
                      <strong className="d-block text-muted mb-1">
                        Assignment Reveal
                      </strong>
                      <span>{formatDate(group.assignment_reveal_date)}</span>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Members List */}
      <Row className="mb-4">
        <Col>
          <Card className={styles.membersCard}>
            <Card.Header className={styles.membersHeader}>
              <FaUsers className="me-2" />
              Members ({group.members?.length || 0})
            </Card.Header>
            <ListGroup variant="flush">
              {group.members && group.members.length > 0 ? (
                group.members.map((member: Member) => (
                  <ListGroup.Item
                    key={member.user_id}
                    className={styles.memberItem}
                  >
                    <div className={styles.memberInfo}>
                      <div className={styles.memberAvatar}>
                        {member.first_name?.[0] || member.username[0]}
                      </div>
                      <div className={styles.memberDetails}>
                        <strong>
                          {member.first_name} {member.last_name}
                        </strong>
                      </div>
                    </div>
                    {group?.created_by_id === member.user_id && (
                      <Badge bg="success">
                        <FaCog className="me-1" />
                        Organiser
                      </Badge>
                    )}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center text-muted py-4">
                  <FaInfoCircle className="me-2" />
                  No members yet. Share the group code to invite people!
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Danger Zone - Only visible to group owner */}
      {isOwner && (
        <Row>
          <Col>
            <Card className={styles.dangerCard}>
              <Card.Header className="text-danger">
                <FaInfoCircle className="me-2" />
                Danger Zone
              </Card.Header>
              <Card.Body>
                <div className="mb-4 pb-4 border-bottom">
                  <h6 className="fw-bold mb-2">Leave Group</h6>
                  <p className="text-muted mb-3">
                    Remove yourself from this group. You won't be able to rejoin
                    unless invited again by another member.
                  </p>
                  <Button
                    variant="outline-danger"
                    onClick={handleLeaveGroup}
                    disabled={isActionLoading}
                  >
                    <FaSignOutAlt className="me-2" />
                    Leave Group
                  </Button>
                </div>

                <div>
                  <h6 className="fw-bold mb-2 text-danger">Delete Group</h6>
                  <p className="text-muted mb-3">
                    Permanently delete this group. This action{" "}
                    <strong>cannot be undone</strong>. All members, assignments,
                    and data will be lost.
                  </p>
                  <Button
                    variant="danger"
                    onClick={handleDeleteGroup}
                    disabled={isActionLoading}
                  >
                    <FaTrash className="me-2" />
                    Delete Group Permanently
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Confirmation Modals */}
      {confirmModal.type === "leave" && (
        <ConfirmModal
          show={confirmModal.show}
          onHide={() => setConfirmModal({ show: false, type: null })}
          onConfirm={confirmAction}
          title="Leave Group"
          message={`Are you sure you want to leave "${group?.group_name}"?`}
          confirmLabel="Leave Group"
          variant="danger"
          isLoading={isActionLoading}
          alertMessage="You won't be able to rejoin unless invited again by another member."
        />
      )}

      {confirmModal.type === "delete" && (
        <ConfirmModal
          show={confirmModal.show}
          onHide={() => setConfirmModal({ show: false, type: null })}
          onConfirm={confirmAction}
          title="Delete Group"
          message={`Are you sure you want to permanently delete "${group?.group_name}"?`}
          confirmLabel="Delete Permanently"
          variant="danger"
          isLoading={isActionLoading}
          alertMessage="This action CANNOT be undone. All members, assignments, and data will be lost forever."
        />
      )}

      {confirmModal.type === "toggle-status" && (
        <ConfirmModal
          show={confirmModal.show}
          onHide={() => setConfirmModal({ show: false, type: null })}
          onConfirm={confirmAction}
          title={group?.is_open ? "Close Group" : "Open Group"}
          message={
            group?.is_open
              ? `Close "${group?.group_name}"? No one else can join and members can open their wraps.`
              : `Open "${group?.group_name}"? People can join again but they cannot open their wraps until you close the group again.`
          }
          confirmLabel={group?.is_open ? "Close Group" : "Open Group"}
          variant={group?.is_open ? "warning" : "success"}
          isLoading={isActionLoading}
        />
      )}
    </Container>
  );
}
