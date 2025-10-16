import { useSession } from "next-auth/react";
import { apiRequest as baseApiRequest } from "@/lib/utils";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown> | unknown[];
  headers?: Record<string, string>;
}

/**
 * Custom hook for making authenticated API requests in client components
 * Automatically includes the user's access token from the session
 * @returns An object with the apiRequest function and session data
 */
export function useApiRequest() {
  const { data: session, status } = useSession();

  const apiRequest = (
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<Response> => {
    return baseApiRequest(endpoint, {
      ...options,
      accessToken: session?.accessToken,
    });
  };

  return {
    apiRequest,
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
