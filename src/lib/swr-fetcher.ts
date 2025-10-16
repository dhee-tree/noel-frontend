/**
 * SWR fetcher function that includes authentication
 */
export async function swrFetcher<T = unknown>(
  url: string,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.") as Error & {
      info?: unknown;
      status?: number;
    };
    error.info = await response.json().catch(() => ({}));
    error.status = response.status;
    throw error;
  }

  return response.json();
}
