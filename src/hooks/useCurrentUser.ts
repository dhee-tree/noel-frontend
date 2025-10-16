"use client";

import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_verified: boolean;
}

/**
 * Custom hook to fetch and manage current user data with SWR.
 * Uses NextAuth session as initial data to avoid unnecessary API calls.
 * Only fetches from API when data needs to be refreshed (mutations).
 *
 * @example
 * const { user, isLoading, error, mutateUser } = useCurrentUser();
 *
 * // After updating user data:
 * await mutateUser(); // Refetch from server
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const shouldFetch = !!session?.accessToken && !!apiUrl;
  const endpoint = shouldFetch ? `${apiUrl}/api/users/me/` : null;

  // Convert session data to User format for initial data
  const initialData: User | undefined =
    session?.user && session?.isVerified !== undefined
      ? {
          id: parseInt(session.user.id || "0"),
          username: session.user.email || "",
          email: session.user.email || "",
          first_name: session.user.firstName || "",
          last_name: session.user.lastName || "",
          role: session.user.role || "USER",
          is_verified: session.isVerified || false,
        }
      : undefined;

  const {
    data,
    error,
    isLoading,
    mutate: mutateUser,
  } = useSWR<User>(
    endpoint,
    (url: string) => swrFetcher<User>(url, session?.accessToken as string),
    {
      fallbackData: initialData, // Use session data as initial/fallback
      revalidateOnMount: false, // Don't fetch on mount if we have fallback data
      revalidateOnFocus: false, // Don't refetch when window regains focus
      revalidateOnReconnect: true, // Refetch when reconnecting
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
      shouldRetryOnError: false, // Don't retry on error (avoid spamming failed auth)
    }
  );

  return {
    user: data,
    isLoading: status === "loading" || isLoading,
    error,
    mutateUser,
    isVerified: data?.is_verified ?? false,
  };
}

/**
 * Mutate the current user data globally (useful for mutations outside of components using the hook)
 */
export function mutateCurrentUser() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return mutate(`${apiUrl}/api/users/me/`);
}
