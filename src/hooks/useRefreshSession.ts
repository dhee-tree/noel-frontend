"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

/**
 * Custom hook to refresh the session by fetching updated user data from backend.
 * Use this after operations that change user data (name, email, verification status).
 *
 * @example
 * const refreshSession = useRefreshSession();
 *
 * // After updating user profile
 * await updateProfile(data);
 * await refreshSession();
 */
export function useRefreshSession() {
  const { data: session, update } = useSession();

  const refreshSession = useCallback(async () => {
    if (!session?.accessToken) {
      console.warn("No access token available for session refresh");
      return null;
    }

    try {
      // Fetch fresh user data from backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch updated user data");
      }

      const userData = await response.json();

      // Update the session with fresh data
      // This triggers NextAuth to re-run the JWT callback
      await update({
        user: {
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          role: userData.role,
        },
        isVerified: userData.is_verified,
      });

      return userData;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return null;
    }
  }, [session?.accessToken, update]);

  return refreshSession;
}
