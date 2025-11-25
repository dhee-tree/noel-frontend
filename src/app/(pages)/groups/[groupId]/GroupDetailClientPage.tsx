"use client";
import React, { useState } from "react";
import {
  Container,
  Button,
  Badge,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaEdit,
  FaCopy,
  FaUsers,
  FaCalendar,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTrash,
  FaLock,
  FaUnlock,
  FaGift,
  FaBell,
  FaHeart,
  FaCrown,
  FaShareAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  useGroupDetail,
  useIsGroupOwner,
  useApiRequest,
  useGroupPick,
} from "@/hooks";
import {
  EditGroupModal,
  ConfirmModal,
  RevealModal,
  PingUserModal,
  ViewWishlistFromPickModal,
  ShareGroupModal,
} from "@/components/modals";
import { toast } from "react-toastify";
import Link from "next/link";
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
  const { isOwner } = useIsGroupOwner(groupId);
  const { apiRequest } = useApiRequest();
  const { pick } = useGroupPick(groupId, group?.is_open);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: "leave" | "delete" | "archive" | "toggle-status" | null;
  }>({ show: false, type: null });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleCopyCode = () => {
    if (group?.group_code) {
      navigator.clipboard.writeText(group.group_code);
      toast.success("Group code copied!");
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
          successMessage = `Group is now ${group?.is_open ? "Closed" : "Open"}`;
          break;
      }

      const response = await apiRequest(endpoint, { method });

      if (!response.ok) {
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
      family: "🏡",
      friends: "🎉",
      gaming: "🎮",
      custom: "✨",
    };
    return theme ? themeMap[theme] || "🎁" : "🎁";
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Container className={styles.container}>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading group...</p>
        </div>
      </Container>
    );
  }

  if (error || !group) {
    return (
      <Container className={styles.container}>
        <Alert variant="danger">
          <p>Unable to load group details.</p>
          <Button
            variant="outline-danger"
            onClick={() => router.push("/groups")}
            size="sm"
          >
            <FaArrowLeft className="me-2" /> Back
          </Button>
        </Alert>
      </Container>
    );
  }

  const currencySymbol =
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: group.budget_currency || "USD",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || "$";

  return (
    <Container className={styles.container}>
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          router.push("/groups");
        }}
        className={styles.backButton}
      >
        <FaArrowLeft className="me-2" /> Back to Groups
      </Link>

      {/* --- Hero Section --- */}
      <div className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div className={styles.groupIdentity}>
            <div className={styles.themeIcon}>{getThemeEmoji(group.theme)}</div>
            <div>
              <div className={styles.badgeGroup}>
                <Badge
                  bg={
                    group.is_archived
                      ? "danger"
                      : group.is_open
                      ? "success"
                      : "secondary"
                  }
                  pill
                >
                  {group.is_archived
                    ? "Archived"
                    : group.is_open
                    ? "Open for Joining"
                    : "Closed"}
                </Badge>
                {group.is_white_elephant && (
                  <Badge bg="warning" text="dark" pill>
                    White Elephant
                  </Badge>
                )}
              </div>
              <h1 className={styles.groupTitle}>{group.group_name}</h1>
              {group.description && (
                <p className={styles.description}>{group.description}</p>
              )}
            </div>
          </div>

          <div className={styles.actionBar}>
            {isOwner && (
              <>
                <Button
                  variant={group.is_open ? "light" : "success"}
                  size="sm"
                  onClick={handleToggleStatus}
                  disabled={isActionLoading}
                  className="d-flex align-items-center gap-2"
                >
                  {group.is_open ? <FaLock /> : <FaUnlock />}
                  {group.is_open ? "Close Group" : "Open Group"}
                </Button>
                <EditGroupModal
                  trigger={{
                    type: "button",
                    label: "Edit",
                    icon: <FaEdit />,
                    variant: "light",
                    size: "sm",
                  }}
                  onSuccess={mutateGroup}
                  group={group}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Dashboard Grid --- */}
      <div className={styles.dashboardGrid}>
        {/* Left: Action Card (Reveal OR Invite Code) */}
        {group.is_open ? (
          <div className={`${styles.actionCard} ${styles.highlight}`}>
            <div className={styles.actionTitle}>Invite Friends</div>
            <div className="mb-3">
              <strong className="h2 d-block mb-1">{group.group_code}</strong>
              <span className="text-muted small">Group Code</span>
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <Button onClick={handleCopyCode} variant="primary" size="sm">
                <FaCopy className="me-2" /> Copy Code
              </Button>
              <ShareGroupModal
                groupCode={group.group_code || ""}
                groupName={group.group_name || "Group"}
                trigger={{
                  type: "button",
                  label: "Share",
                  icon: <FaShareAlt />,
                  variant: "outline-primary",
                  size: "sm",
                }}
              />
            </div>
          </div>
        ) : (
          <div className={styles.actionCard}>
            <div className={styles.actionTitle}>Your Match</div>
            <div className="mb-3">
              <RevealModal
                trigger={{
                  type: "button",
                  label: pick ? "View Your Pick" : "Reveal Match",
                  icon: <FaGift />,
                  variant: pick ? "outline-success" : "success",
                  size: "lg",
                  className: "px-4 py-2 fw-bold shadow-sm",
                }}
                groupId={groupId}
                leftToPick={Math.max((group?.members_left_to_pick ?? 0) - 1, 0)}
                pick={pick}
              />
            </div>
            {pick && (
              <div className="d-flex flex-column gap-2 w-100 px-4">
                {pick.wishlist_id ? (
                  <ViewWishlistFromPickModal
                    trigger={{
                      type: "button",
                      label: "View Wishlist",
                      icon: <FaHeart />,
                      variant: "outline-danger",
                      size: "sm",
                      className: "w-100",
                    }}
                    wishlistId={pick.wishlist_id}
                  />
                ) : (
                  <PingUserModal
                    trigger={{
                      type: "button",
                      label: "Ping for Wishlist",
                      variant: "outline-secondary",
                      size: "sm",
                      icon: <FaBell />,
                      className: "w-100",
                    }}
                    pickID={pick.pick_id}
                    pingType="wishlist"
                    modalSize="lg"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Right: Info Grid */}
        <div className={styles.infoGridContainer}>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <FaMoneyBillWave className={styles.infoIcon} /> Budget
            </div>
            <div className={styles.infoValue}>
              {group.budget_min || group.budget_max ? (
                <>
                  {currencySymbol}
                  {group.budget_min || 0} - {currencySymbol}
                  {group.budget_max || "?"}
                </>
              ) : (
                "None"
              )}
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <FaCalendar className={styles.infoIcon} /> Exchange Date
            </div>
            <div className={styles.infoValue}>
              {formatDate(group.gift_exchange_deadline)}
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <FaMapMarkerAlt className={styles.infoIcon} /> Location
            </div>
            <div className={styles.infoValue}>
              {group.exchange_location || "Remote / TBD"}
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <FaCalendar className={styles.infoIcon} /> RSVP Deadline
            </div>
            <div className={styles.infoValue}>
              {formatDate(group.join_deadline)}
            </div>
          </div>
        </div>
      </div>

      {/* --- Members Section --- */}
      <div className="mb-5">
        <h3 className={styles.sectionTitle}>
          <FaUsers className="text-primary" /> Members (
          {group.members?.length || 0})
        </h3>
        <div className={styles.membersCard}>
          {group.members && group.members.length > 0 ? (
            group.members.map((member: Member) => (
              <div key={member.user_id} className={styles.memberItem}>
                <div className={styles.memberInfo}>
                  <div
                    className={`${styles.memberAvatar} ${
                      group.created_by_id === member.user_id
                        ? styles.isOwnerAvatar
                        : ""
                    }`}
                  >
                    {member.first_name?.[0] || member.username[0]}
                  </div>
                  <div>
                    <span className={styles.memberName}>
                      {member.first_name} {member.last_name}{" "}
                      {group.created_by_id === member.user_id && (
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Group Organiser</Tooltip>}
                        >
                          <span
                            className="text-warning ms-1"
                            style={{ cursor: "help" }}
                          >
                            <FaCrown size={12} />
                          </span>
                        </OverlayTrigger>
                      )}
                    </span>
                    <span className={styles.joinDate}>
                      Joined {formatDate(member.date_created)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">
              No members yet. Invite some friends!
            </div>
          )}
        </div>
      </div>

      {/* --- Danger Zone (Owner Only) --- */}
      {isOwner && (
        <div className={styles.dangerZone}>
          <h5 className="mb-3 fw-bold text-secondary">Group Management</h5>
          <div className={styles.dangerGrid}>
            <Button
              variant="outline-secondary"
              onClick={handleLeaveGroup}
              disabled={isActionLoading}
              className="d-flex align-items-center justify-content-center gap-2"
            >
              <FaSignOutAlt /> Leave Group
            </Button>
            <Button
              variant="outline-danger"
              onClick={handleDeleteGroup}
              disabled={isActionLoading}
              className="d-flex align-items-center justify-content-center gap-2"
            >
              <FaTrash /> Delete Group
            </Button>
          </div>
        </div>
      )}

      {/* --- Modals (Logic remains unchanged) --- */}
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
        />
      )}

      {confirmModal.type === "delete" && (
        <ConfirmModal
          show={confirmModal.show}
          onHide={() => setConfirmModal({ show: false, type: null })}
          onConfirm={confirmAction}
          title="Delete Group"
          message={`Are you sure you want to delete "${group?.group_name}"?`}
          confirmLabel="Delete Permanently"
          variant="danger"
          isLoading={isActionLoading}
          alertMessage="This cannot be undone."
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
              ? "Closing the group will allow members to see their matches. No new members can join."
              : "Opening the group allows new members to join, but hides matches."
          }
          confirmLabel={group?.is_open ? "Close Group" : "Open Group"}
          variant={group?.is_open ? "danger" : "success"}
          isLoading={isActionLoading}
        />
      )}
    </Container>
  );
}
