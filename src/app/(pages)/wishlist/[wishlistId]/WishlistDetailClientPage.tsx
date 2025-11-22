"use client";
import React, { useState } from "react";
import {
  Container,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaPlus,
  FaGift,
  FaEdit,
  FaTrash,
  FaStore,
  FaEye,
  FaLock,
  FaCheckCircle,
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

export const getPriorityLabel = (priority?: string | null) => {
  if (!priority) return "No Priority";
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

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
      <div className="mb-4">
        <Button
          variant="link"
          className={styles.backButton}
          onClick={() => router.push("/wishlist")}
        >
          <FaArrowLeft className="me-2" />
          Back to Wishlists
        </Button>
        <div className={styles.headerCard}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.wishlistTitle}>
                <FaGift className="me-3 text-info" />
                {wishlist.name}
              </h1>
              <p className={styles.wishlistSubtitle}>
                Add items you&apos;d like to receive for this Secret Santa
                exchange.
              </p>
            </div>
            <div className="d-flex gap-2">
              <AddWishlistItemModal
                trigger={{
                  type: "button",
                  label: "Add Item",
                  variant: "dark",
                  className: "d-flex align-items-center gap-2 px-4 py-2",
                  icon: <FaPlus />,
                }}
                wishlistId={wishlistId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <FaGift size={48} className="text-muted mb-3 opacity-50" />
          <h4 className="text-muted">Your wishlist is empty</h4>
          <p className="text-muted mb-4">
            Add a few options to help your Secret Santa pick the perfect gift!
          </p>
          <AddWishlistItemModal
            trigger={{
              type: "button",
              label: "Add Your First Item",
              variant: "outline-primary",
              icon: <FaPlus />,
            }}
            wishlistId={wishlistId}
          />
        </div>
      ) : (
        <div className={styles.itemsGrid}>
          {items.map((item) => (
            <div key={item.item_id} className={styles.wishlistCard}>
              {/* Top Section: Title & Badges */}
              <div className={styles.cardHeader}>
                <h5 className={styles.itemName}>{item.name}</h5>
              </div>

              <div className={styles.badges}>
                <Badge
                  bg={getPriorityColor(item.priority)}
                  className={styles.pillBadge}
                >
                  {getPriorityLabel(item.priority)}
                </Badge>
                {!item.is_public && (
                  <Badge bg="secondary" className={styles.pillBadge}>
                    <FaLock size={10} className="me-1" /> Private
                  </Badge>
                )}
                {item.is_purchased && (
                  <Badge bg="success" className={styles.pillBadge}>
                    <FaCheckCircle size={10} className="me-1" /> Purchased
                  </Badge>
                )}
              </div>

              {/* Middle: Description */}
              <p className={styles.itemDescription}>
                {item.description || "No description provided."}
              </p>

              {/* Bottom: Footer with Price & Actions */}
              <div className={styles.cardFooter}>
                <div className={styles.metaInfo}>
                  {item.price_estimate ? (
                    <div className={styles.priceTag}>
                      £{Number(item.price_estimate).toFixed(2)}
                    </div>
                  ) : (
                    <div className="text-muted small">No price</div>
                  )}
                  {item.store && (
                    <div className={styles.storeName}>
                      <FaStore /> {item.store}
                    </div>
                  )}
                </div>

                <div className={styles.actionButtons}>
                  <ViewWishlistItemModal
                    trigger={{
                      type: "button",
                      variant: "light",
                      icon: <FaEye color="#4a5568" />,
                      size: "sm",
                      className: styles.iconBtn,
                    }}
                    wishlistId={wishlistId}
                    itemId={item.item_id}
                  />
                  <EditWishlistItemModal
                    trigger={{
                      type: "button",
                      variant: "light",
                      icon: <FaEdit color="#3182ce" />,
                      size: "sm",
                      className: styles.iconBtn,
                    }}
                    wishlistId={wishlistId}
                    itemId={item.item_id}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    className={styles.iconBtn}
                    onClick={() => handleDeleteItem(item.item_id, item.name)}
                  >
                    <FaTrash color="#e53e3e" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
