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
  Alert,
  ListGroup,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaPlus,
  FaGift,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaEye,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useWishlist, useWishlistItems, useApiRequest } from "@/hooks";
import {
  ConfirmModal,
  AddWishlistItemModal,
  EditWishlistItemModal,
  ViewWishlistItemModal,
} from "@/components/modals";
import { toast } from "react-toastify";
import styles from "./WishlistDetailClientPage.module.css";

interface WishlistDetailClientPageProps {
  wishlistId: string;
}

export default function WishlistDetailClientPage({
  wishlistId,
}: WishlistDetailClientPageProps) {
  const router = useRouter();
  const {
    wishlist,
    isLoading: wishlistLoading,
    error: wishlistError,
  } = useWishlist(wishlistId);
  const {
    items,
    isLoading: itemsLoading,
    mutateItems,
  } = useWishlistItems(wishlistId);
  const { apiRequest } = useApiRequest();
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    itemId: string;
    itemName: string;
  }>({ show: false, itemId: "", itemName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteWishlist, setShowDeleteWishlist] = useState(false);
  const [isDeletingWishlist, setIsDeletingWishlist] = useState(false);

  const isLoading = wishlistLoading || itemsLoading;

  const getPriorityColor = (priority?: string | null) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "secondary";
    }
  };

  const getPriorityLabel = (priority?: string | null) => {
    if (!priority) return "No Priority";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    setDeleteModal({ show: true, itemId, itemName });
  };

  const confirmDeleteWishlist = async () => {
    setIsDeletingWishlist(true);
    try {
      const response = await apiRequest(`/api/wishlists/${wishlistId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete wishlist");
      }

      toast.success("Wishlist deleted successfully");
      router.push("/wishlist");
    } catch (error) {
      console.error("Delete wishlist error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete wishlist"
      );
      setIsDeletingWishlist(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await apiRequest(
        `/api/wishlists/${wishlistId}/items/${deleteModal.itemId}/`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete item");
      }

      toast.success("Item deleted successfully");
      setDeleteModal({ show: false, itemId: "", itemName: "" });
      await mutateItems();
    } catch (error) {
      console.error("Delete item error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
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
          <p className="mt-3 text-muted">Loading wishlist...</p>
        </div>
      </Container>
    );
  }

  if (wishlistError || !wishlist) {
    return (
      <Container className={styles.container}>
        <Alert variant="danger">
          <Alert.Heading>Error Loading Wishlist</Alert.Heading>
          <p>
            {wishlistError?.message ||
              "Unable to load wishlist. It may not exist or you don't have access."}
          </p>
          <Button
            variant="outline-danger"
            onClick={() => router.push("/wishlist")}
          >
            <FaArrowLeft className="me-2" />
            Back to Wishlists
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Button
            variant="link"
            className={styles.backButton}
            onClick={() => router.push("/wishlist")}
          >
            <FaArrowLeft className="me-2" />
            Back to Wishlists
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className={styles.headerCard}>
            <Card.Body>
              <div className={styles.headerContent}>
                <div>
                  <h1 className={styles.wishlistTitle}>
                    <FaGift className="me-2" />
                    {wishlist.name}
                  </h1>
                  <p className="text-muted mb-0">
                    Add items you&apos;d like to receive for this Secret Santa
                    exchange
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <AddWishlistItemModal
                    trigger={{
                      type: "button",
                      label: "Add Item",
                      variant: "dark",
                      icon: <FaPlus />,
                    }}
                    wishlistId={wishlistId}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Items List */}
      <Row>
        <Col>
          {items.length === 0 ? (
            <Card className={styles.emptyState}>
              <Card.Body className="text-center py-5">
                <FaGift size={64} className="text-muted mb-3" />
                <h3>No Items Yet</h3>
                <p className="text-muted mb-4">
                  Start building your wishlist by adding items you&apos;d like
                  to receive!
                </p>
                <AddWishlistItemModal
                  trigger={{
                    type: "button",
                    label: "Add Your First Item",
                    variant: "dark",
                    icon: <FaPlus />,
                  }}
                  wishlistId={wishlistId}
                />
              </Card.Body>
            </Card>
          ) : (
            <ListGroup>
              {items.map((item) => (
                <ListGroup.Item key={item.item_id} className={styles.itemCard}>
                  <Row className="align-items-start">
                    <Col xs={12} md={8}>
                      <div className="d-flex flex-wrap align-items-start gap-2 mb-2">
                        <h5 className={styles.itemName}>{item.name}</h5>
                        {item.priority && (
                          <Badge bg={getPriorityColor(item.priority)}>
                            {getPriorityLabel(item.priority)} Priority
                          </Badge>
                        )}
                        {!item.is_public && (
                          <Badge bg="secondary">Private</Badge>
                        )}
                        {item.is_purchased && (
                          <Badge bg="success">Purchased</Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className={styles.itemDescription}>
                          {item.description}
                        </p>
                      )}
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        {item.price_estimate && (
                          <span className={styles.price}>
                            £{Number(item.price_estimate).toFixed(2)}
                          </span>
                        )}
                        {item.store && (
                          <span className={styles.store}>{item.store}</span>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                          >
                            <FaExternalLinkAlt className="me-1" />
                            View Item
                          </a>
                        )}
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      md={4}
                      className="text-start text-md-end mt-3 mt-md-0"
                    >
                      <div className={styles.actionButtons}>
                        <ViewWishlistItemModal
                          trigger={{
                            type: "button",
                            variant: "outline-dark",
                            icon: <FaEye />,
                            size: "sm",
                          }}
                          wishlistId={wishlistId}
                          itemId={item.item_id}
                        />
                        <EditWishlistItemModal
                          trigger={{
                            type: "button",
                            variant: "outline-primary",
                            icon: <FaEdit />,
                            size: "sm",
                          }}
                          wishlistId={wishlistId}
                          itemId={item.item_id}
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            handleDeleteItem(item.item_id, item.name)
                          }
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      {/* Delete Wishlist Confirmation Modal */}
      <ConfirmModal
        show={showDeleteWishlist}
        onHide={() => setShowDeleteWishlist(false)}
        onConfirm={confirmDeleteWishlist}
        title="Delete Wishlist"
        message={`Are you sure you want to delete "${
          wishlist?.group_name
            ? `${wishlist.group_name} Wishlist`
            : "this wishlist"
        }"?`}
        confirmLabel="Delete Wishlist"
        variant="danger"
        isLoading={isDeletingWishlist}
        alertMessage="This will permanently delete the wishlist and all its items. This action cannot be undone."
      />

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, itemId: "", itemName: "" })}
        onConfirm={confirmDelete}
        title="Delete Wishlist Item"
        message={`Are you sure you want to delete "${deleteModal.itemName}"?`}
        confirmLabel="Delete Item"
        variant="danger"
        isLoading={isDeleting}
        alertMessage="This action cannot be undone."
      />
    </Container>
  );
}
