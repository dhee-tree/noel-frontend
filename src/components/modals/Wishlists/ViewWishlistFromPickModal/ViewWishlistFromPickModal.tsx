"use client";
import React, { useRef, useState } from "react";
import { Alert, Spinner, Badge } from "react-bootstrap";
import {
  FaExternalLinkAlt,
  FaStore,
  FaTag,
  FaCheckCircle,
} from "react-icons/fa";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { useWishlist } from "@/hooks";
import { WishlistItem } from "@/types/wishlist";
import { getPriorityLabel } from "@/app/(pages)/wishlist/[wishlistId]/WishlistDetailClientPage";
import styles from "./ViewWishlistFromPickModal.module.css";

interface TriggerConfig {
  type: "button";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
}

interface ViewWishlistFromPickModalProps {
  trigger?: TriggerConfig;
  wishlistId: string;
}

export const ViewWishlistFromPickModal: React.FC<
  ViewWishlistFromPickModalProps
> = ({ trigger, wishlistId }) => {
  const [fetchData, setFetchData] = useState(false);
  const modalRef = useRef<BaseModalRef>(null);

  const { wishlist, isLoading, error } = useWishlist(
    fetchData ? wishlistId : undefined
  );

  const wishlistItems: WishlistItem[] = wishlist?.items || [];
  const handleClose = () => modalRef.current?.close();

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

  return (
    <BaseModal
      ref={modalRef}
      onHide={handleClose}
      trigger={trigger}
      title="Wishlist Items"
      size="lg"
      onEntering={() => setFetchData(true)}
      footerButtons={[
        { label: "Close", variant: "secondary", onClick: handleClose },
      ]}
    >
      {error ? (
        <Alert variant="danger">
          Failed to load wishlist items. Please try again.
        </Alert>
      ) : isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading ideas...</p>
        </div>
      ) : (
        <div className="p-2">
          {wishlistItems.length === 0 ? (
            <Alert variant="info" className="text-center">
              No items found in this wishlist.
            </Alert>
          ) : (
            <div className={styles.gridContainer}>
              {wishlistItems.map((item) => (
                <div key={item.item_id} className={styles.wishlistCard}>
                  {/* Header: Title & Badges */}
                  <div className={styles.cardHeader}>
                    <h5 className={styles.itemName}>{item.name}</h5>
                  </div>

                  <div className={styles.badges}>
                    <Badge
                      bg={getPriorityColor(item.priority)}
                      className={styles.priorityBadge}
                    >
                      {getPriorityLabel(item.priority)}
                    </Badge>
                    {item.is_purchased && (
                      <Badge bg="success" className={styles.priorityBadge}>
                        <FaCheckCircle className="me-1" /> Purchased
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className={styles.description}>
                    {item.description || "No description provided."}
                  </p>

                  {/* Footer: Price, Store, Link */}
                  <div className={styles.cardFooter}>
                    <div className={styles.metaRow}>
                      {item.price_estimate !== null &&
                        item.price_estimate !== undefined && (
                          <div className={styles.priceTag}>
                            <FaTag />
                            <span>
                              £{Number(item.price_estimate).toFixed(2)}
                            </span>
                          </div>
                        )}

                      {item.store && (
                        <div className={styles.storeTag} title={item.store}>
                          <FaStore />
                          {item.store}
                        </div>
                      )}
                    </div>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionButton}
                      >
                        View Product <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
};

export default ViewWishlistFromPickModal;
