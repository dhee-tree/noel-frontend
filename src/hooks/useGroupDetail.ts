"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { Group } from "./useUserGroups";

/**
 * Custom hook to fetch a single group's details with SWR.
 *
 * @param groupId - The ID of the group to fetch
 * @example
 * const { group, isLoading, error, mutateGroup } = useGroupDetail(groupId);
 */
export function useGroupDetail(groupId: string) {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const shouldFetch = !!session?.accessToken && !!apiUrl && !!groupId;
  const endpoint = shouldFetch ? `${apiUrl}/api/groups/${groupId}/` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateGroup,
  } = useSWR<Group>(
    endpoint,
    (url: string) => swrFetcher<Group>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  return {
    group: data,
    isLoading,
    error,
    mutateGroup,
  };
}
