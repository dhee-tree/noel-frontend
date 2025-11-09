"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";

interface IsOwnerResponse {
  is_owner: boolean;
}

/**
 * Custom hook to check if the current user is the owner/creator of a group.
 *
 * @param groupId - The ID of the group to check ownership for
 * @example
 * const { isOwner, isLoading, error } = useIsGroupOwner(groupId);
 */
export function useIsGroupOwner(groupId: string) {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const shouldFetch = !!session?.accessToken && !!apiUrl && !!groupId;
  const endpoint = shouldFetch
    ? `${apiUrl}/api/groups/${groupId}/is-owner/`
    : null;

  const { data, error, isLoading } = useSWR<IsOwnerResponse>(
    endpoint,
    (url: string) =>
      swrFetcher<IsOwnerResponse>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  return {
    isOwner: data?.is_owner ?? false,
    isLoading,
    error,
  };
}
