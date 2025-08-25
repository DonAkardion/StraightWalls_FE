export interface FetcherOptions extends Omit<RequestInit, "body" | "headers"> {
  data?: unknown; // JSON payload (не тільки string, може бути масив)
  token?: string; // JWT token
  headers?: Record<string, string>; // additional headers
  params?: Record<string, string | number | boolean>; // query params
}

export async function fetcher<T>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { data, token, headers = {}, params, ...rest } = options;

  // Add params to URL
  let finalUrl = url;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, val]) => {
        acc[key] = String(val);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    finalUrl += `?${query}`;
  }

  try {
    const response = await fetch(finalUrl, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store", 
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
