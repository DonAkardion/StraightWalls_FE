import { fetcher } from "@/utils/fetcher";
import { Client, ClientObject } from "@/types/client";

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
  data: ClientObject;
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

// GET /api/clients/:id
export async function getClientById(
  token: string,
  id: number
): Promise<Client> {
  const res = await fetcher<ClientResponse>(`${API_BASE}/api/clients/${id}`, {
    token,
  });
  return res.data;
}

// POST /api/clients
export async function createClient(
  token: string,
  client: Pick<Client, "full_name" | "phone_number">,
  object: Pick<ClientObject, "name" | "address" | "description">
): Promise<Client> {
  // 1. створюємо клієнта
  const res = await fetcher<ClientResponse>(`${API_BASE}/api/clients`, {
    method: "POST",
    token,
    data: client,
  });

  const createdClient = res.data;

  // 2. створюємо перший об'єкт клієнта
  const objRes = await fetcher<ClientObjectResponse>(
    `${API_BASE}/api/client-objects`,
    {
      method: "POST",
      token,
      data: {
        client_id: createdClient.id,
        ...object,
      },
    }
  );

  const createdObject = objRes.data;

  // 3. повертаємо клієнта з об'єктом у масиві
  return {
    ...createdClient,
    objects: [createdObject],
  };
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

// --- Об’єкти клієнтів ---

// POST /api/client-objects
export async function addClientObject(
  token: string,
  clientId: number,
  object: Pick<ClientObject, "name" | "address" | "description">
): Promise<ClientObject> {
  const res = await fetcher<ClientObjectResponse>(
    `${API_BASE}/api/client-objects`,
    {
      method: "POST",
      token,
      data: {
        client_id: clientId,
        ...object,
      },
    }
  );
  return res.data;
}

// PUT /api/client-objects/:id (оновлення об’єкта)
export async function updateClientObject(
  token: string,
  objectId: number,
  updates: Partial<Omit<ClientObject, "id" | "client_id">>
): Promise<ClientObject> {
  const res = await fetcher<ClientObjectResponse>(
    `${API_BASE}/api/client-objects/${objectId}`,
    {
      method: "PUT",
      token,
      data: updates,
    }
  );
  return res.data;
}

// DELETE /api/client-objects/:id
export async function deleteClientObject(
  token: string,
  objectId: number
): Promise<void> {
  await fetcher<{ status: string }>(
    `${API_BASE}/api/client-objects/${objectId}`,
    {
      method: "DELETE",
      token,
    }
  );
}
