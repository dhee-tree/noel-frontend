"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { Wishlist } from "@/types/wishlist";

/**
 * Custom hook to fetch a single wishlist's details.
 *
 * @param wishlistId - The ID of the wishlist to fetch
 * @example
 * const { wishlist, isLoading, error, mutateWishlist } = useWishlist(wishlistId);
 */
export function useWishlist(wishlistId?: string) {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const shouldFetch = !!session?.accessToken && !!apiUrl && !!wishlistId;
  const endpoint = shouldFetch ? `${apiUrl}/api/wishlists/${wishlistId}/` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateWishlist,
  } = useSWR<Wishlist>(
    endpoint,
    (url: string) => swrFetcher<Wishlist>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  return {
    wishlist: data,
    isLoading,
    error,
    mutateWishlist,
  };
}
