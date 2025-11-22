"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";

/**
 * Response shape for a group pick
 */
export interface GroupPick {
  pick_id: string;
  picked_name: string;
  picked_address: string;
  wishlist_id: string;
}

/**
 * Custom hook to fetch a group's pick (either the list endpoint or a specific pick).
 *
 * @param groupId - UUID of the group
 * @param pickId - optional pick id to fetch a specific pick
 */
export function useGroupPick(groupId: string | null | undefined| null) {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const shouldFetch = !!session?.accessToken && !!apiUrl && !!groupId;
  const endpoint = shouldFetch ? `${apiUrl}/api/groups/${groupId}/pick/` : null;

  const { data, error, isLoading, mutate } = useSWR<GroupPick | null>(
    endpoint,
    (url: string) => swrFetcher<GroupPick>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  return {
    pick: data ?? null,
    isLoading,
    error,
    mutatePick: mutate,
  };
}

export default useGroupPick;
