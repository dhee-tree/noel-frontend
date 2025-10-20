"use client";
import React, { useState, useMemo } from "react";
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
  FaCog,
  FaSignOutAlt,
  FaEye,
} from "react-icons/fa";
import { useUserGroups } from "@/hooks/useUserGroups";
import { CreateGroupModal, JoinGroupModal } from "@/components/modals";
import { toast } from "react-toastify";
import styles from "./GroupsClientPage.module.css";

export default function GroupsClientPage() {
  const { groups, isLoading } = useUserGroups();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and categorize groups
  const { activeGroups, closedGroups } = useMemo(() => {
    const filtered = groups?.filter((g) =>
      g.group_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      activeGroups: filtered?.filter((g) => g.is_open) || [],
      closedGroups: filtered?.filter((g) => !g.is_open) || [],
    };
  }, [groups, searchQuery]);

  const handleCopyCode = (code: string | undefined, name: string) => {
    if (code) {
      navigator.clipboard?.writeText(code);
      toast.success(`Copied code for "${name}"!`);
    } else {
      toast.error("No code available");
    }
  };

  const handleLeaveGroup = (groupId: string, name: string) => {
    // TODO: Implement leave group API call
    toast.info(`Leave group "${name}" - Not yet implemented`);
  };

  const handleSettings = (groupId: string, name: string) => {
    // TODO: Navigate to settings or open modal
    toast.info(`Settings for "${name}" - Not yet implemented`);
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
      {!groups || groups.length === 0 ? (
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
          {activeGroups.length > 0 && (
            <div className="mb-4">
              <h3 className={styles.sectionTitle}>
                Active Groups ({activeGroups.length})
              </h3>
              <Card>
                <ListGroup variant="flush">
                  {activeGroups.map((group) => (
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
                            {group.group_code && (
                              <>
                                {" • Code: "}
                                <code className={styles.codeText}>
                                  {group.group_code}
                                </code>
                              </>
                            )}
                          </div>
                        </Col>
                        <Col md={3}>
                          <Badge bg="success" className={styles.badge}>
                            Active
                          </Badge>
                        </Col>
                        <Col md={4} className="text-md-end mt-2 mt-md-0">
                          <div className={styles.actionButtons}>
                            <Button
                              size="sm"
                              className={styles.viewButton}
                              href={`/group/${group.group_id}`}
                              title="View group"
                            >
                              <FaEye />
                            </Button>
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
                                title="Copy code"
                              >
                                <FaCopy />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className={styles.settingsButton}
                              onClick={() =>
                                handleSettings(group.group_id, group.group_name)
                              }
                              title="Settings"
                            >
                              <FaCog />
                            </Button>
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

          {/* Closed Groups */}
          {closedGroups.length > 0 && (
            <div className="mb-4">
              <h3 className={styles.sectionTitle}>
                Closed Groups ({closedGroups.length})
              </h3>
              <Card>
                <ListGroup variant="flush">
                  {closedGroups.map((group) => (
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
                          <Badge bg="secondary" className={styles.badge}>
                            Closed
                          </Badge>
                        </Col>
                        <Col md={4} className="text-md-end mt-2 mt-md-0">
                          <div className={styles.actionButtons}>
                            <Button
                              size="sm"
                              className={styles.viewButton}
                              href={`/group/${group.group_id}`}
                              title="View archive"
                            >
                              <FaEye />
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

          {/* No Results */}
          {searchQuery &&
            activeGroups.length === 0 &&
            closedGroups.length === 0 && (
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
    </Container>
  );
}
