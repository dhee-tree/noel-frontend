"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { WishlistItem } from "@/types/wishlist";

/**
 * Custom hook to fetch all items for a specific wishlist.
 *
 * @param wishlistId - The ID of the wishlist to fetch items for
 * @example
 * const { items, isLoading, error, mutateItems } = useWishlistItems(wishlistId);
 */
export function useWishlistItems(wishlistId: string) {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const shouldFetch = !!session?.accessToken && !!apiUrl && !!wishlistId;
  const endpoint = shouldFetch
    ? `${apiUrl}/api/wishlists/${wishlistId}/items/`
    : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateItems,
  } = useSWR<WishlistItem[]>(
    endpoint,
    (url: string) =>
      swrFetcher<WishlistItem[]>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  return {
    items: data || [],
    isLoading,
    error,
    mutateItems,
  };
}
