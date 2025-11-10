"use client";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  ListGroup,
  Dropdown,
} from "react-bootstrap";
import {
  FaPlus,
  FaGift,
  FaArrowRight,
  FaList,
  FaEllipsisV,
  FaTrash,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUserWishlists, useUserGroups, useApiRequest } from "@/hooks";
import { CreateWishlistModal, ConfirmModal } from "@/components/modals";
import { toast } from "react-toastify";
import styles from "./WishlistsClientPage.module.css";

export default function WishlistsClientPage() {
  const router = useRouter();
  const {
    wishlists,
    isLoading: wishlistsLoading,
    mutateWishlists,
  } = useUserWishlists();
  const {
    activeGroups,
    archivedGroups,
    isLoading: groupsLoading,
  } = useUserGroups();
  const { apiRequest } = useApiRequest();

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    wishlistId: string;
    wishlistName: string;
  }>({ show: false, wishlistId: "", wishlistName: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const allGroups = [...activeGroups, ...archivedGroups];
  const isLoading = wishlistsLoading || groupsLoading;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteWishlist = (wishlistId: string, wishlistName: string) => {
    setDeleteModal({ show: true, wishlistId, wishlistName });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await apiRequest(
        `/api/wishlists/${deleteModal.wishlistId}/`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete wishlist");
      }

      toast.success("Wishlist deleted successfully");
      setDeleteModal({ show: false, wishlistId: "", wishlistName: "" });
      await mutateWishlists();
    } catch (error) {
      console.error("Delete wishlist error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete wishlist"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Container className={styles.container}>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading your wishlists...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className={styles.pageTitle}>
                <FaGift className="me-2" />
                My Wishlists
              </h1>
              <p className="text-muted">
                Manage your wishlists for all your Secret Santa groups.
              </p>
            </div>
            <CreateWishlistModal
              trigger={{
                type: "button",
                label: "Create Wishlist",
                icon: <FaPlus />,
                variant: "dark",
              }}
              groups={allGroups}
              onSuccess={mutateWishlists}
            />
          </div>
        </Col>
      </Row>

      {/* Empty State */}
      {wishlists.length === 0 ? (
        <Card className={styles.emptyState}>
          <Card.Body className="text-center py-5">
            <FaList size={64} className="text-muted mb-3" />
            <h3>No Wishlists Yet</h3>
            <p className="text-muted mb-4">
              Create your first wishlist to let your Secret Santa know what
              you&apos;d like!
            </p>
            {allGroups.length > 0 ? (
              <CreateWishlistModal
                trigger={{
                  type: "button",
                  label: "Create Your First Wishlist",
                  variant: "dark",
                }}
                groups={allGroups}
                onSuccess={mutateWishlists}
              />
            ) : (
              <div>
                <p className="text-muted mb-3">
                  You need to join or create a group first.
                </p>
                <Button variant="brand" onClick={() => router.push("/groups")}>
                  Go to Groups
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {wishlists.map((wishlist) => {
              const group = allGroups.find(
                (g) => g.group_id === wishlist.group
              );

              return (
                <ListGroup.Item
                  key={wishlist.wishlist_id}
                  className={styles.wishlistItem}
                >
                  <Row className="align-items-center">
                    <Col md={7}>
                      <div className="d-flex align-items-start gap-3">
                        <div className={styles.wishlistIcon}>
                          <FaGift />
                        </div>
                        <div>
                          <h5 className={styles.wishlistName}>
                            {group?.group_name || "Unknown Group"} Wishlist
                          </h5>
                          <div className="text-muted small">
                            <span>
                              Updated {formatDate(wishlist.date_updated)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={5} className="text-md-end mt-2 mt-md-0">
                      <div className="d-flex gap-2 justify-content-md-end">
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={() =>
                            router.push(`/wishlist/${wishlist.wishlist_id}`)
                          }
                        >
                          View Items
                          <FaArrowRight className="ms-2" />
                        </Button>
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            id={`dropdown-${wishlist.wishlist_id}`}
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {/* <Dropdown.Divider /> */}
                            <Dropdown.Item
                              className="text-danger"
                              onClick={() =>
                                handleDeleteWishlist(
                                  wishlist.wishlist_id,
                                  group?.group_name
                                    ? `${group.group_name} Wishlist`
                                    : "Unknown Group Wishlist"
                                )
                              }
                            >
                              <FaTrash className="me-2" />
                              Delete Wishlist
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card>
      )}

      <ConfirmModal
        show={deleteModal.show}
        onHide={() =>
          setDeleteModal({ show: false, wishlistId: "", wishlistName: "" })
        }
        onConfirm={confirmDelete}
        title="Delete Wishlist"
        message={`Are you sure you want to delete "${deleteModal.wishlistName}"?`}
        confirmLabel="Delete Wishlist"
        variant="danger"
        isLoading={isDeleting}
        alertMessage="This will permanently delete the wishlist and all its items. This action cannot be undone."
      />
    </Container>
  );
}
