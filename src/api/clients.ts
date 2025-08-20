import { fetcher } from "@/utils/fetcher";
import { Client } from "@/types/client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// --- Types of API responses ---
interface ClientsResponse {
  status: string;
  data: Client[];
}

interface ClientResponse {
  status: string;
  data: Client;
}

interface ClientObjectResponse {
  status: string;
  data: string[]; // Client`s Objects list
}

// --- API calls ---

// GET /api/clients
export async function getClients(
  token: string,
  params?: { search?: string; object?: string }
): Promise<Client[]> {
  const res = await fetcher<ClientsResponse>(`${API_BASE}/api/clients`, {
    token,
    params,
  });
  return res.data;
}

// POST /api/clients
export async function createClient(
  token: string,
  client: Omit<Client, "id" | "created_at" | "updated_at">
): Promise<Client> {
  const res = await fetcher<ClientResponse>(`${API_BASE}/api/clients`, {
    method: "POST",
    token,
    data: client,
  });
  return res.data;
}

// PUT /api/clients/:id
export async function updateClient(
  token: string,
  id: number,
  updates: Partial<Omit<Client, "id" | "created_at" | "updated_at">>
): Promise<Client> {
  const res = await fetcher<ClientResponse>(`${API_BASE}/api/clients/${id}`, {
    method: "PUT",
    token,
    data: updates,
  });
  return res.data;
}

// DELETE /api/clients/:id
export async function deleteClient(token: string, id: number): Promise<void> {
  await fetcher<{ status: string }>(`${API_BASE}/api/clients/${id}`, {
    method: "DELETE",
    token,
  });
}

// POST /api/clients/:id/objects
export async function addClientObject(
  token: string,
  id: number,
  object: string
): Promise<string[]> {
  const res = await fetcher<ClientObjectResponse>(
    `${API_BASE}/api/clients/${id}/objects`,
    {
      method: "POST",
      token,
      data: { object },
    }
  );
  return res.data;
}

// DELETE /api/clients/:id/objects/:object
export async function deleteClientObject(
  token: string,
  id: number,
  object: string
): Promise<string[]> {
  const res = await fetcher<ClientObjectResponse>(
    `${API_BASE}/api/clients/${id}/objects/${encodeURIComponent(object)}`,
    {
      method: "DELETE",
      token,
    }
  );
  return res.data;
}
