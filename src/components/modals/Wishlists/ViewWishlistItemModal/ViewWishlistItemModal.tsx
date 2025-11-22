"use client";
import React, { useState, useRef } from "react";
import { Alert, Badge, Spinner } from "react-bootstrap";
import {
  FaEye,
  FaEyeSlash,
  FaExternalLinkAlt,
  FaStore,
  FaTag,
  FaCheckCircle,
} from "react-icons/fa";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { WishlistItem } from "@/types/wishlist.d";
import { getPriorityLabel } from "@/app/(pages)/wishlist/[wishlistId]/WishlistDetailClientPage";
import styles from "./ViewWishlistItemModal.module.css";

interface TriggerConfig {
  type: "button";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
}

interface ViewWishlistItemModalProps {
  trigger?: TriggerConfig;
  wishlistId: string;
  itemId: string;
}

export const ViewWishlistItemModal: React.FC<ViewWishlistItemModalProps> = ({
  trigger,
  wishlistId,
  itemId,
}) => {
  const [fetchData, setFetchData] = useState<boolean>(false);
  const modalRef = useRef<BaseModalRef>(null);

  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = fetchData
    ? `${apiUrl}/api/wishlists/${wishlistId}/items/${itemId}/`
    : null;

  const {
    data: itemData,
    error,
    isLoading,
  } = useSWR<WishlistItem>(
    endpoint,
    (url: string) =>
      swrFetcher<WishlistItem>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  const handleClose = () => {
    modalRef.current?.close();
  };

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
      title="Item Details"
      size="lg"
      onEntering={() => setFetchData(true)}
      footerButtons={[
        {
          label: "Close",
          variant: "secondary",
          onClick: handleClose,
        },
      ]}
    >
      {error ? (
        <Alert variant="danger" className="mb-3">
          Failed to load wishlist item data. Please try again later.
        </Alert>
      ) : isLoading || !itemData ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Fetching details...</p>
        </div>
      ) : (
        <div className={styles.itemDetails}>
          {/* Header Section: Name & Badges */}
          <div className={styles.headerSection}>
            <h2 className={styles.itemName}>{itemData.name}</h2>
            <div className={styles.badgeGroup}>
              <Badge
                bg={getPriorityColor(itemData.priority)}
                className={styles.pillBadge}
              >
                {getPriorityLabel(itemData.priority)}
              </Badge>
              {itemData.is_public ? (
                <Badge bg="success" className={styles.pillBadge}>
                  <FaEye /> Public
                </Badge>
              ) : (
                <Badge bg="secondary" className={styles.pillBadge}>
                  <FaEyeSlash /> Private
                </Badge>
              )}
              {itemData.is_purchased && (
                <Badge bg="success" className={styles.pillBadge}>
                  <FaCheckCircle /> Purchased
                </Badge>
              )}
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Description Box */}
            {itemData.description && (
              <div className={styles.descriptionBox}>
                <span className={styles.sectionLabel}>Description</span>
                <p className={styles.descriptionText}>{itemData.description}</p>
              </div>
            )}

            {/* Meta Info Row (Price & Store) */}
            {(itemData.price_estimate || itemData.store) && (
              <div className={styles.metaRow}>
                {itemData.price_estimate && (
                  <div className={styles.metaBlock}>
                    <span className={styles.sectionLabel}>
                      <FaTag className="me-1" /> Price Estimate
                    </span>
                    <div className={styles.priceValue}>
                      £{Number(itemData.price_estimate).toFixed(2)}
                    </div>
                  </div>
                )}

                {itemData.store && (
                  <div className={styles.metaBlock}>
                    <span className={styles.sectionLabel}>
                      <FaStore className="me-1" /> Store
                    </span>
                    <div className={styles.storeValue}>{itemData.store}</div>
                  </div>
                )}
              </div>
            )}

            {/* Product Link Button */}
            {itemData.link && (
              <a
                href={itemData.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                View Product Website <FaExternalLinkAlt />
              </a>
            )}

            {/* Private Item Warning */}
            {!itemData.is_public && (
              <Alert variant="warning" className="mt-2 mb-0">
                <FaEyeSlash className="me-2" />
                This item is private. Only you can see it.
              </Alert>
            )}
          </div>
        </div>
      )}
    </BaseModal>
  );
};
