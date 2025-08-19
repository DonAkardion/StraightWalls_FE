export interface FetcherOptions extends Omit<RequestInit, "body" | "headers"> {
  data?: Record<string, string>; // JSON payload
  token?: string; // JWT token
  headers?: Record<string, string>; // additional headers
}

export async function fetcher<T>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { data, token, headers = {}, ...rest } = options;

  try {
    const response = await fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        responseBody?.message ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return responseBody as T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error?.message || "An unexpected error occurred");
  }
}
