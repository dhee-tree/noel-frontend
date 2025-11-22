"use client";
import React, { useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { FaPlus, FaGift, FaList, FaTrash, FaArrowRight } from "react-icons/fa";
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
  const { activeGroups, isLoading: groupsLoading } = useUserGroups();
  const { apiRequest } = useApiRequest();

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    wishlistId: string;
    wishlistName: string;
  }>({ show: false, wishlistId: "", wishlistName: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const allGroups = [...activeGroups];
  const isLoading = wishlistsLoading || groupsLoading;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.pageTitle}>My Wishlists</h1>
          <p className={styles.subtitle}>
            Create and manage wishlists for your Secret Santa exchanges.
          </p>
        </div>
        <CreateWishlistModal
          trigger={{
            type: "button",
            label: "New Wishlist",
            icon: <FaPlus />,
            variant: "dark",
            size: "lg",
          }}
          groups={allGroups}
        />
      </div>

      {/* Empty State */}
      {wishlists.length === 0 ? (
        <div className={styles.emptyState}>
          <FaList size={48} className="text-secondary mb-3 opacity-50" />
          <h3 className="h4 text-dark mb-2">No Wishlists Yet</h3>
          <p className="text-muted mb-4" style={{ maxWidth: "400px" }}>
            Create a wishlist to help your Secret Santa find the perfect gift
            for you!
          </p>
          {allGroups.length > 0 ? (
            <CreateWishlistModal
              trigger={{
                type: "button",
                label: "Create Your First Wishlist",
                variant: "dark",
              }}
              groups={allGroups}
            />
          ) : (
            <div className="d-flex flex-column align-items-center gap-3">
              <p className="text-muted m-0">
                You need to join a group before creating a wishlist.
              </p>
              <Button
                variant="outline-primary"
                onClick={() => router.push("/groups")}
              >
                Browse Groups
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Wishlist Grid */
        <div className={styles.grid}>
          {wishlists.map((wishlist) => (
            <div key={wishlist.wishlist_id} className={styles.card}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <FaGift />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.wishlistName} title={wishlist.name}>
                    {wishlist.name}
                  </h3>
                  <p className={styles.metaText}>
                    Updated {formatDate(wishlist.date_updated)}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>
                <span className={styles.itemCount}>
                  {wishlist.items?.length || 0} Items
                </span>

                <div className={styles.actionButtons}>
                  <button
                    className={styles.iconBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWishlist(wishlist.wishlist_id, wishlist.name);
                    }}
                    title="Delete Wishlist"
                  >
                    <FaTrash size={14} />
                  </button>

                  <button
                    className={`${styles.iconBtn} ${styles.viewBtn}`}
                    onClick={() =>
                      router.push(`/wishlist/${wishlist.wishlist_id}`)
                    }
                  >
                    View <FaArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        alertMessage="This will permanently delete the wishlist and all its items."
      />
    </Container>
  );
}
