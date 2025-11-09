"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";

export interface Group {
  group_id: string;
  group_name: string;
  group_code?: string;
  is_open?: boolean;
  is_archived?: boolean;
  created_by_name?: string;
  created_by_id?: number;
  date_created?: string;
  date_updated?: string;
  member_count?: number;
  
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

interface GroupsResponse {
  active: Group[];
  archived: Group[];
}

/**
 * Custom hook to fetch and manage user's groups with SWR.
 * Returns separate arrays for active and archived groups.
 *
 * @example
 * const { activeGroups, archivedGroups, isLoading, error, mutateGroups } = useUserGroups();
 *
 * // After joining a group:
 * await mutateGroups();
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
  } = useSWR<GroupsResponse>(
    endpoint,
    (url: string) => swrFetcher<GroupsResponse>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

  return {
    activeGroups: data?.active || [],
    archivedGroups: data?.archived || [],
    isLoading,
    error,
    mutateGroups,
  };
}
