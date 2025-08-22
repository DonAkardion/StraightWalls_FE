import { fetcher } from "@/utils/fetcher";
import { Service } from "@/types/service";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// --- Типи API відповідей ---
interface ServicesResponse {
  status: string;
  data: Service[];
}

interface ServiceResponse {
  status: string;
  data: Service;
}

// --- API функції ---

// GET /api/services?type=&active_only=&search=
export async function getServices(
  token: string,
  params?: {
    type?: "main" | "additional";
    active_only?: boolean;
    search?: string;
  }
): Promise<Service[]> {
  const res = await fetcher<ServicesResponse>(`${API_BASE}/api/services`, {
    token,
    params,
  });
  return res.data;
}

// GET /api/services/:id
export async function getServiceById(
  token: string,
  id: number
): Promise<Service> {
  const res = await fetcher<ServiceResponse>(`${API_BASE}/api/services/${id}`, {
    token,
  });
  return res.data;
}

// POST /api/services
export async function createService(
  token: string,
  service: Omit<Service, "id" | "created_at" | "updated_at">
): Promise<Service> {
  const res = await fetcher<ServiceResponse>(`${API_BASE}/api/services`, {
    method: "POST",
    token,
    data: service,
  });
  return res.data;
}

// PUT /api/services/:id
export async function updateService(
  token: string,
  id: number,
  updates: Partial<Omit<Service, "id" | "created_at" | "updated_at">>
): Promise<Service> {
  const res = await fetcher<ServiceResponse>(`${API_BASE}/api/services/${id}`, {
    method: "PUT",
    token,
    data: updates,
  });
  return res.data;
}

// DELETE /api/services/:id
export async function deleteService(token: string, id: number): Promise<void> {
  await fetcher<{ status: string }>(`${API_BASE}/api/services/${id}`, {
    method: "DELETE",
    token,
  });
}

// POST /api/services/:id/activate
export async function activateService(
  token: string,
  id: number
): Promise<Service> {
  const res = await fetcher<ServiceResponse>(
    `${API_BASE}/api/services/${id}/activate`,
    {
      method: "POST",
      token,
    }
  );
  return res.data;
}

// POST /api/services/:id/deactivate
export async function deactivateService(
  token: string,
  id: number
): Promise<Service> {
  const res = await fetcher<ServiceResponse>(
    `${API_BASE}/api/services/${id}/deactivate`,
    {
      method: "POST",
      token,
    }
  );
  return res.data;
}
