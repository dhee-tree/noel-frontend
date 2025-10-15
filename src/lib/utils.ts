import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  accessToken?: string;
  headers?: Record<string, string>;
}

/**
 * Helper function to make authenticated API requests
 * @param endpoint - The API endpoint (relative to NEXT_PUBLIC_API_URL)
 * @param options - Request options including method, body, and accessToken
 * @returns The fetch Response object
 * @throws Error if API URL is not configured or if the request fails
 */
export async function apiRequest(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const { method = "GET", body, accessToken, headers = {} } = options;

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) {
    throw new Error("API URL not configured");
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...headers,
    },
  };

  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  const url = `${apiBase}${endpoint}`;
  const response = await fetch(url, fetchOptions);

  return response;
}
