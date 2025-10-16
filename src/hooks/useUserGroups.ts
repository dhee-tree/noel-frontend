"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";

export interface Group {
  id: string | number;
  name: string;
  code?: string;
  members?: number;
  members_count?: number;
  is_active?: boolean;
}

/**
 * Custom hook to fetch and manage user's groups with SWR.
 *
 * @example
 * const { groups, isLoading, error, mutateGroups } = useUserGroups();
 *
 * // After joining a group:
 * await mutateGroups(); // Refetch groups
 */
export function useUserGroups() {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const shouldFetch = !!session?.accessToken && !!apiUrl;
  const endpoint = shouldFetch ? `${apiUrl}/api/groups/my-groups/` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateGroups,
  } = useSWR<Group[]>(
    endpoint,
    (url: string) => swrFetcher<Group[]>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  // Normalize group data
  const normalizedGroups = data?.map((g) => ({
    id: g.id ?? Math.random(),
    name: g.name ?? "Unnamed Group",
    code: g.code,
    members: g.members_count ?? g.members,
    isActive: g.is_active ?? true,
  }));

  return {
    groups: normalizedGroups,
    isLoading,
    error,
    mutateGroups,
  };
}
