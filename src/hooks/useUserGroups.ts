"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";

export interface Group {
  group_id: string;
  group_name: string;
  group_code?: string;
  is_open?: boolean;
  created_by_name?: string;
  created_by_id?: number;
  date_created?: string;
  date_updated?: string;
  member_count?: number;
  
  // New fields from Amos
  assignment_reveal_date?: string | null;
  gift_exchange_deadline?: string | null;
  wishlist_deadline?: string | null;
  join_deadline?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_currency?: string;
  description?: string | null;
  exchange_location?: string | null;
  theme?: string;
  is_white_elephant?: boolean;
  
  members?: Array<{
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_wrapped: boolean;
    date_created: string;
  }>;
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
  const endpoint = shouldFetch ? `${apiUrl}/api/groups/` : null;

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

  // Normalize group data to maintain backward compatibility
  const normalizedGroups = data?.map((g) => ({
    id: g.group_id,
    name: g.group_name,
    code: g.group_code,
    members: g.member_count,
    isActive: g.is_open ?? true,
    // Keep original fields for direct access
    ...g,
  }));

  return {
    groups: normalizedGroups,
    isLoading,
    error,
    mutateGroups,
  };
}
