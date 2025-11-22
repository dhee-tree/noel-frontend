"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Container, Spinner, Badge } from "react-bootstrap";
import {
  FaSearch,
  FaPlus,
  FaUsers,
  FaCopy,
  FaEye,
  FaChevronDown,
  FaChevronRight,
  FaLock,
  FaUnlock,
  FaArrowRight,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUserGroups, useApiRequest } from "@/hooks";
import {
  CreateGroupModal,
  JoinGroupModal,
  ConfirmModal,
} from "@/components/modals";
import { toast } from "react-toastify";
import styles from "./GroupsClientPage.module.css";
import { useSession } from "next-auth/react";

export default function GroupsClientPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { activeGroups, archivedGroups, isLoading, mutateGroups } =
    useUserGroups();
  const { apiRequest } = useApiRequest();
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [confirmGroupState, setConfirmGroupState] = useState<{
    show: boolean;
    groupId: string;
    groupName: string;
    isOpen?: boolean;
  }>({ show: false, groupId: "", groupName: "" });
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  // Track ownership for each group
  const [ownershipMap, setOwnershipMap] = useState<Map<string, boolean>>(
    new Map()
  );

  useEffect(() => {
    const fetchOwnership = async () => {
      if (!session?.accessToken) return;
      const allGroups = [...activeGroups, ...archivedGroups];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      for (const group of allGroups) {
        if (ownershipMap.has(group.group_id)) continue;
        try {
          const response = await fetch(
            `${apiUrl}/api/groups/${group.group_id}/is-owner/`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setOwnershipMap((prev) =>
              new Map(prev).set(group.group_id, data.is_owner)
            );
          }
        } catch (error) {
          console.error(
            `Failed to fetch ownership for ${group.group_id}`,
            error
          );
        }
      }
    };
    fetchOwnership();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroups, archivedGroups, session?.accessToken]);

  // Filter groups
  const filteredActiveGroups = useMemo(() => {
    return activeGroups.filter((g) =>
      g.group_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeGroups, searchQuery]);

  const filteredArchivedGroups = useMemo(() => {
    return archivedGroups.filter((g) =>
      g.group_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [archivedGroups, searchQuery]);

  const handleCopyCode = (code: string | undefined, name: string) => {
    if (code) {
      navigator.clipboard?.writeText(code);
      toast.success(`Copied code for "${name}"!`);
    } else {
      toast.error("No code available");
    }
  };

  const handleToggleStatus = (
    groupName: string,
    groupID: string,
    groupStatus?: boolean
  ) => {
    setConfirmGroupState({
      show: true,
      groupId: groupID,
      isOpen: groupStatus,
      groupName: groupName,
    });
  };

  const handleGroupStatusChange = async () => {
    setIsStatusLoading(true);
    try {
      const response = await apiRequest(
        `/api/groups/${confirmGroupState.groupId}/toggle-status/`,
        { method: "POST" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update status");
      }
      toast.success(
        `Successfully ${confirmGroupState.isOpen ? "closed" : "opened"} group`
      );
      await mutateGroups();
    } catch (error) {
      console.error("Update group status error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setIsStatusLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className={styles.container}>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading your groups...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      {/* Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Your Groups</h1>
        <p className={styles.subtitle}>
          Manage all your Secret Santa exchanges in one place.
        </p>
      </div>

      {/* Controls */}
      <div className={styles.controlBar}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actionGroup}>
          <JoinGroupModal
            trigger={{
              type: "button",
              label: "Join Group",
              icon: <FaUsers />,
              variant: "outline-success",
            }}
          />
          <CreateGroupModal
            trigger={{
              type: "button",
              label: "Create Group",
              icon: <FaPlus />,
              variant: "success",
            }}
          />
        </div>
      </div>

      {/* Empty State */}
      {activeGroups.length === 0 && archivedGroups.length === 0 ? (
        <div className={styles.emptyState}>
          <FaUsers size={48} color="#cbd5e0" className="mb-3" />
          <h3 className="h5 text-secondary">No Groups Yet</h3>
          <p className="text-muted mb-4">
            Create your first group or join an existing one to get started!
          </p>
        </div>
      ) : (
        <>
          {/* Active Groups Grid */}
          {filteredActiveGroups.length > 0 && (
            <>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Active Groups</span>
                <span className="badge bg-light text-dark border">
                  {filteredActiveGroups.length}
                </span>
              </div>
              <div className={styles.groupsGrid}>
                {filteredActiveGroups.map((group) => {
                  const isOwner = ownershipMap.get(group.group_id);
                  return (
                    <div key={group.group_id} className={styles.groupCard}>
                      <div
                        className={`${styles.statusLine} ${
                          group.is_open ? styles.statusOpen : ""
                        }`}
                      />
                      <div className={styles.cardHeader}>
                        <div>
                          <h3 className={styles.groupName}>
                            {group.group_name}
                          </h3>
                          <div className={styles.memberCount}>
                            <FaUsers size={12} /> {group.member_count || 0}{" "}
                            members
                          </div>
                        </div>
                      </div>

                      <div className={styles.badges}>
                        <Badge
                          bg={group.is_open ? "success" : "secondary"}
                          className={styles.badgePill}
                        >
                          {group.is_open ? "Open" : "Closed"}
                        </Badge>
                        {group.is_white_elephant && (
                          <Badge
                            bg="warning"
                            text="dark"
                            className={styles.badgePill}
                          >
                            White Elephant
                          </Badge>
                        )}
                      </div>

                      <div className={styles.cardFooter}>
                        <div className={styles.roleBadge}>
                          {isOwner ? "Admin" : "Member"}
                        </div>
                        <div className={styles.actionButtons}>
                          {/* Quick Actions */}
                          {group.group_code && (
                            <button
                              className={styles.iconBtn}
                              onClick={() =>
                                handleCopyCode(
                                  group.group_code,
                                  group.group_name
                                )
                              }
                              title="Copy Invite Code"
                            >
                              <FaCopy size={14} />
                            </button>
                          )}

                          {isOwner && (
                            <button
                              className={styles.iconBtn}
                              onClick={() =>
                                handleToggleStatus(
                                  group.group_name,
                                  group.group_id,
                                  group.is_open
                                )
                              }
                              title={
                                group.is_open ? "Close Group" : "Open Group"
                              }
                            >
                              {group.is_open ? (
                                <FaLock size={14} />
                              ) : (
                                <FaUnlock size={14} />
                              )}
                            </button>
                          )}

                          <button
                            className={`${styles.iconBtn} ${styles.viewBtn}`}
                            onClick={() =>
                              router.push(`/groups/${group.group_id}`)
                            }
                            title="View Group"
                          >
                            <FaArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Archived Groups Section */}
          {filteredArchivedGroups.length > 0 && (
            <div className="mb-5">
              <div className={styles.sectionHeader}>
                <button
                  className={styles.toggleArchived}
                  onClick={() => setShowArchived(!showArchived)}
                >
                  {showArchived ? <FaChevronDown /> : <FaChevronRight />}
                  Archived Groups ({filteredArchivedGroups.length})
                </button>
              </div>

              {showArchived && (
                <div className={styles.groupsGrid}>
                  {filteredArchivedGroups.map((group) => (
                    <div key={group.group_id} className={styles.groupCard}>
                      <div
                        className={`${styles.statusLine} ${styles.statusArchived}`}
                      />
                      <div className={styles.cardHeader}>
                        <div>
                          <h3 className={styles.groupName}>
                            {group.group_name}
                          </h3>
                          <div className={styles.memberCount}>
                            <FaUsers size={12} /> {group.member_count || 0}{" "}
                            members
                          </div>
                        </div>
                      </div>
                      <div className={styles.badges}>
                        <Badge bg="danger" className={styles.badgePill}>
                          Archived
                        </Badge>
                      </div>
                      <div className={styles.cardFooter}>
                        <div className={styles.roleBadge}>Read Only</div>
                        <button
                          className={`${styles.iconBtn} ${styles.viewBtn}`}
                          onClick={() =>
                            router.push(`/groups/${group.group_id}`)
                          }
                          title="View Group"
                        >
                          <FaEye size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {searchQuery &&
            filteredActiveGroups.length === 0 &&
            filteredArchivedGroups.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">
                  No groups found matching &quot;{searchQuery}&quot;
                </p>
              </div>
            )}
        </>
      )}

      <ConfirmModal
        show={confirmGroupState.show}
        onHide={() =>
          setConfirmGroupState({ show: false, groupId: "", groupName: "" })
        }
        onConfirm={handleGroupStatusChange}
        title={confirmGroupState.isOpen ? "Close Group" : "Open Group"}
        message={
          confirmGroupState.isOpen
            ? `Close "${confirmGroupState.groupName}"? No one else can join and members can open their wraps.`
            : `Open "${confirmGroupState.groupName}"?`
        }
        confirmLabel={confirmGroupState.isOpen ? "Close Group" : "Open Group"}
        variant={confirmGroupState.isOpen ? "danger" : "success"}
        isLoading={isStatusLoading}
      />
    </Container>
  );
}
