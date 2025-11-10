"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { Wishlist } from "@/types/wishlist";

/**
 * Custom hook to fetch all wishlists for the current user across all groups.
 *
 * @example
 * const { wishlists, isLoading, error, mutateWishlists } = useUserWishlists();
 */
export function useUserWishlists() {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const shouldFetch = !!session?.accessToken && !!apiUrl;
  const endpoint = shouldFetch ? `${apiUrl}/api/wishlists/` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateWishlists,
  } = useSWR<Wishlist[]>(
    endpoint,
    (url: string) =>
      swrFetcher<Wishlist[]>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  return {
    wishlists: data || [],
    isLoading,
    error,
    mutateWishlists,
  };
}
