"use client";
import React, { useState, useRef } from "react";
import { Alert, Badge, Spinner, Row, Col } from "react-bootstrap";
import {
  FaEye,
  FaEyeSlash,
  FaExternalLinkAlt,
  FaStore,
  FaTag,
} from "react-icons/fa";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import styles from "./ViewWishlistItemModal.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { WishlistItem } from "@/types/wishlist.d";

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

  const getPriorityLabel = (priority?: string | null) => {
    if (!priority) return "No Priority";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <BaseModal
      ref={modalRef}
      onHide={handleClose}
      trigger={trigger}
      title="Wishlist Item Details"
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
          <p className="mt-3 text-muted">Fetching wishlist item details...</p>
        </div>
      ) : (
        <div className={styles.itemDetails}>
          {/* Item Name */}
          <div className="mb-4">
            <h4 className="mb-2">{itemData.name}</h4>
            <div className="d-flex gap-2 align-items-center">
              <Badge bg={getPriorityColor(itemData.priority)}>
                {getPriorityLabel(itemData.priority)} Priority
              </Badge>
              {itemData.is_public ? (
                <Badge bg="success" className="d-flex align-items-center gap-1">
                  <FaEye size={12} />
                  Public
                </Badge>
              ) : (
                <Badge
                  bg="secondary"
                  className="d-flex align-items-center gap-1"
                >
                  <FaEyeSlash size={12} />
                  Private
                </Badge>
              )}
              {itemData.is_purchased && <Badge bg="success">Purchased</Badge>}
            </div>
          </div>

          {/* Description */}
          {itemData.description && (
            <div className="mb-4">
              <h6 className="text-muted mb-2">Description</h6>
              <p className={styles.description}>{itemData.description}</p>
            </div>
          )}

          <Row>
            {/* Price Estimate */}
            {itemData.price_estimate && (
              <Col md={6} className="mb-4">
                <h6 className="text-muted mb-2">
                  <FaTag className="me-2" />
                  Price Estimate
                </h6>
                <p className={styles.priceEstimate}>
                  £{Number(itemData.price_estimate).toFixed(2)}
                </p>
              </Col>
            )}

            {/* Store */}
            {itemData.store && (
              <Col md={6} className="mb-4">
                <h6 className="text-muted mb-2">
                  <FaStore className="me-2" />
                  Store
                </h6>
                <p>{itemData.store}</p>
              </Col>
            )}
          </Row>

          {itemData.link && (
            <div className="mb-4">
              <h6 className="text-muted mb-2">Product Link</h6>
              <a
                href={itemData.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.productLink} d-inline-flex align-items-center gap-2`}
              >
                <FaExternalLinkAlt size={14} />
                View Product
              </a>
            </div>
          )}

          {!itemData.is_public && (
            <Alert variant={"warning"}>
              <small>
                <>
                  <FaEyeSlash className="me-2" />
                  This item is private and only visible to you.
                </>
              </small>
            </Alert>
          )}
        </div>
      )}
    </BaseModal>
  );
};
