import { fetcher } from "@/utils/fetcher";
import { Material } from "@/types/material";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// GET /api/materials
export async function getMaterials(token: string): Promise<Material[]> {
  const res = await fetcher<Material[]>(`${API_BASE}/api/materials`, { token });
  return res;
}

// GET /api/materials/:id
export async function getMaterialById(
  token: string,
  id: number
): Promise<Material> {
  const res = await fetcher<Material>(`${API_BASE}/api/materials/${id}`, {
    token,
  });
  return res;
}

// POST /api/materials
export async function createMaterial(
  token: string,
  material: Omit<Material, "id" | "created_at" | "updated_at" | "base_margin">
): Promise<Material> {
  const res = await fetcher<Material>(`${API_BASE}/api/materials`, {
    method: "POST",
    token,
    data: material,
  });
  return res;
}

// PUT /api/materials/:id
export async function updateMaterial(
  token: string,
  id: number,
  updates: Partial<
    Omit<Material, "id" | "created_at" | "updated_at" | "base_margin">
  >
): Promise<Material> {
  const res = await fetcher<Material>(`${API_BASE}/api/materials/${id}`, {
    method: "PUT",
    token,
    data: updates,
  });
  return res;
}

// DELETE /api/materials/:id
export async function deleteMaterial(token: string, id: number): Promise<void> {
  await fetcher<{ status: string }>(`${API_BASE}/api/materials/${id}`, {
    method: "DELETE",
    token,
  });
}

// PATCH /api/materials/:id/stock
export async function updateMaterialStock(
  token: string,
  id: number,
  quantity: number
): Promise<Material> {
  const res = await fetcher<Material>(`${API_BASE}/api/materials/${id}/stock`, {
    method: "PATCH",
    token,
    data: { quantity },
  });
  return res;
}
