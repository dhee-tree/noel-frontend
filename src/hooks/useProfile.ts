"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { UserProfile } from "@/types/profile.d";

/**
 * Custom hook to fetch and manage user profile with SWR.
 *
 * @returns {object} - Contains profile data, loading state, error, and mutate function
 */
export function useProfile() {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR<UserProfile>(
    session?.accessToken ? `${apiUrl}/api/profile/` : null,
    (url: string) =>
      swrFetcher<UserProfile>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
      shouldRetryOnError: true,
    }
  );

  return {
    profile,
    isLoading,
    error,
    mutateProfile: mutate,
  };
}
