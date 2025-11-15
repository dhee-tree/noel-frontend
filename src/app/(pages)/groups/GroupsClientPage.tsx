"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import {
  FaSearch,
  FaPlus,
  FaUsers,
  FaCopy,
  FaSignOutAlt,
  FaEye,
  FaChevronDown,
  FaChevronRight,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUserGroups, useApiRequest } from "@/hooks";
import {
  CreateGroupModal,
  JoinGroupModal,
  ConfirmModal,
} from "@/components/modals";
import { InfoTooltip } from "@/components/ui";
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
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    groupId: string;
    groupName: string;
  }>({ show: false, groupId: "", groupName: "" });
  const [isLeaving, setIsLeaving] = useState(false);
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
        // Skip if we already have ownership info
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

  // Filter groups based on search query
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

  const handleLeaveGroup = (groupId: string, name: string) => {
    setConfirmModal({ show: true, groupId, groupName: name });
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

  const confirmLeaveGroup = async () => {
    setIsLeaving(true);
    try {
      const response = await apiRequest(
        `/api/groups/${confirmModal.groupId}/leave/`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to leave group");
      }

      toast.success(`Successfully left "${confirmModal.groupName}"`);
      setConfirmModal({ show: false, groupId: "", groupName: "" });
      await mutateGroups();
    } catch (error) {
      console.error("Leave group error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to leave group"
      );
    } finally {
      setIsLeaving(false);
    }
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
        throw new Error(errorData.detail || "Failed to update group status");
      }

      toast.success(
        `Successfully ${confirmGroupState.isOpen ? "closed" : "opened"} group`
      );
      await mutateGroups();
    } catch (error) {
      console.error("Update group status error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update group status"
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
      <Row className="mb-4">
        <Col>
          <h1 className={styles.pageTitle}>Your Groups</h1>
          <p className="text-muted">
            Manage all your Secret Santa groups in one place
          </p>
        </Col>
      </Row>

      {/* Actions Bar */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Group className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <Form.Control
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex gap-2 justify-content-md-end">
          <CreateGroupModal
            trigger={{
              type: "button",
              label: "Create Group",
              icon: <FaPlus />,
              variant: "brand",
            }}
          />
          <JoinGroupModal
            trigger={{
              type: "button",
              label: "Join Group",
              icon: <FaUsers />,
              variant: "brandOutline",
            }}
          />
        </Col>
      </Row>

      {/* Empty State */}
      {activeGroups.length === 0 && archivedGroups.length === 0 ? (
        <Card className={styles.emptyState}>
          <Card.Body className="text-center py-5">
            <FaUsers size={64} className="text-muted mb-3" />
            <h3>No Groups Yet</h3>
            <p className="text-muted mb-4">
              Create your first group or join an existing one to get started!
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <CreateGroupModal
                trigger={{
                  type: "button",
                  label: "Create Group",
                  variant: "brand",
                }}
              />
              <JoinGroupModal
                trigger={{
                  type: "button",
                  label: "Join Group",
                  variant: "brandOutline",
                }}
              />
            </div>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Active Groups */}
          {filteredActiveGroups.length > 0 && (
            <div className="mb-4">
              <h3 className={styles.sectionTitle}>
                Active Groups ({filteredActiveGroups.length})
              </h3>
              <Card>
                <ListGroup variant="flush">
                  {filteredActiveGroups.map((group) => (
                    <ListGroup.Item
                      key={group.group_id}
                      className={styles.groupItem}
                    >
                      <Row className="align-items-center">
                        <Col md={5}>
                          <a
                            href={`/groups/${group.group_id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/groups/${group.group_id}`);
                            }}
                            className="d-block text-decoration-none"
                            style={{ color: "inherit", cursor: "pointer" }}
                            aria-label={`Open ${
                              group?.group_name || "Unknown Group"
                            } Wishlist`}
                          >
                            <h5 className={styles.groupName}>
                              {group.group_name}
                            </h5>
                            <div className="text-muted small">
                              <FaUsers className="me-1" />
                              {group.member_count || 0} members
                              {group.group_code && (
                                <>
                                  {" • Code: "}
                                  <code className={styles.codeText}>
                                    {group.group_code}
                                  </code>
                                </>
                              )}
                            </div>
                          </a>
                        </Col>
                        <Col md={3}>
                          <div className="d-flex gap-2 flex-wrap align-items-center">
                            <Badge bg={group.is_open ? "success" : "secondary"}>
                              {group.is_open ? "Open" : "Closed"}
                            </Badge>
                            <InfoTooltip
                              content={
                                group.is_open ? (
                                  <>
                                    <strong>Open Group:</strong> People can
                                    still join this group. Gift assignments
                                    (wraps) are not yet available.
                                  </>
                                ) : (
                                  <>
                                    <strong>Closed Group:</strong> No one can
                                    join anymore. You can now open your wrap to
                                    see who you should gift!
                                  </>
                                )
                              }
                              placement="top"
                              size="sm"
                            />
                            {group.is_white_elephant && (
                              <Badge bg="warning" text="dark">
                                🎲 White Elephant
                              </Badge>
                            )}
                          </div>
                        </Col>
                        <Col md={4} className="text-md-end mt-2 mt-md-0">
                          <div className={styles.actionButtons}>
                            {ownershipMap.get(group.group_id) && (
                              <Button
                                variant={
                                  group.is_open ? "secondary" : "success"
                                }
                                size="sm"
                                onClick={() =>
                                  handleToggleStatus(
                                    group.group_name,
                                    group.group_id,
                                    group.is_open
                                  )
                                }
                                disabled={isStatusLoading}
                                aria-label={
                                  group.is_open ? "Close group" : "Open group"
                                }
                                title={
                                  group.is_open ? "Close group" : "Open group"
                                }
                              >
                                {group.is_open ? <FaLock /> : <FaUnlock />}
                              </Button>
                            )}

                            {group.group_code && (
                              <Button
                                size="sm"
                                className={styles.copyButton}
                                onClick={() =>
                                  handleCopyCode(
                                    group.group_code,
                                    group.group_name
                                  )
                                }
                                aria-label="Copy group code"
                                title="Copy code"
                              >
                                <FaCopy />
                              </Button>
                            )}

                            <Button
                              size="sm"
                              className={styles.leaveButton}
                              onClick={() =>
                                handleLeaveGroup(
                                  group.group_id,
                                  group.group_name
                                )
                              }
                              title="Leave group"
                            >
                              <FaSignOutAlt />
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </div>
          )}

          {/* Archived Groups - Collapsible */}
          {filteredArchivedGroups.length > 0 && (
            <div className="mb-4">
              <Card>
                <Card.Header
                  className={styles.archivedHeader}
                  onClick={() => setShowArchived(!showArchived)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      📦 Archived Groups ({filteredArchivedGroups.length})
                    </h5>
                    <span className="text-muted">
                      {showArchived ? (
                        <>
                          <FaChevronDown className="me-1" /> Hide
                        </>
                      ) : (
                        <>
                          <FaChevronRight className="me-1" /> Show
                        </>
                      )}
                    </span>
                  </div>
                </Card.Header>
                {showArchived && (
                  <ListGroup variant="flush">
                    {filteredArchivedGroups.map((group) => (
                      <ListGroup.Item
                        key={group.group_id}
                        className={styles.groupItem}
                      >
                        <Row className="align-items-center">
                          <Col md={5}>
                            <h5 className={styles.groupName}>
                              {group.group_name}
                            </h5>
                            <div className="text-muted small">
                              <FaUsers className="me-1" />
                              {group.member_count || 0} members
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="d-flex gap-2 flex-wrap">
                              <Badge bg="danger" className={styles.badge}>
                                Archived
                              </Badge>
                              {group.is_white_elephant && (
                                <Badge bg="warning" text="dark">
                                  🎲 White Elephant
                                </Badge>
                              )}
                            </div>
                          </Col>
                          <Col md={4} className="text-md-end mt-2 mt-md-0">
                            <div className={styles.actionButtons}>
                              <Button
                                size="sm"
                                className={styles.viewButton}
                                onClick={() =>
                                  router.push(`/groups/${group.group_id}`)
                                }
                                title="View archived group"
                              >
                                <FaEye />
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card>
            </div>
          )}

          {/* No Results */}
          {searchQuery &&
            filteredActiveGroups.length === 0 &&
            filteredArchivedGroups.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <p className="text-muted">
                    No groups found matching &quot;{searchQuery}&quot;
                  </p>
                </Card.Body>
              </Card>
            )}
        </>
      )}

      {/* Leave Group Confirmation Modal */}
      <ConfirmModal
        show={confirmModal.show}
        onHide={() =>
          setConfirmModal({ show: false, groupId: "", groupName: "" })
        }
        onConfirm={confirmLeaveGroup}
        title="Leave Group"
        message={`Are you sure you want to leave "${confirmModal.groupName}"?`}
        confirmLabel="Leave Group"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isLeaving}
        alertMessage="You'll need to be invited again to rejoin this group."
      />

      {/* Toggle Group Status Confirmation Modal */}
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
            : `Open "${confirmGroupState.groupName}"? People can join again but they cannot open their wraps until you close the group again.`
        }
        confirmLabel={confirmGroupState.isOpen ? "Close Group" : "Open Group"}
        variant={confirmGroupState.isOpen ? "warning" : "success"}
        isLoading={isStatusLoading}
      />
    </Container>
  );
}
