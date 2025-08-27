import { fetcher } from "@/utils/fetcher";
import type { CreateProjectPayload } from "@/types/сreateProjectPayload";
import type { ProjectResponse, ProjectReportResponse } from "@/types/project";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE}/api/projects`;

export async function createProject(data: CreateProjectPayload, token: string) {
  return fetcher<{ success: boolean; projectId: number }>(
    `${API_URL}/complete`,
    {
      method: "POST",
      data,
      token,
    }
  );
}

/**
 * Get All Projects
 */
export async function getProjects(token: string): Promise<ProjectResponse[]> {
  return fetcher<ProjectResponse[]>(API_URL, {
    method: "GET",
    token,
  });
}

/**
 * Get Project by ID
 */
export async function getProjectById(
  id: number,
  token: string
): Promise<ProjectResponse> {
  return fetcher<ProjectResponse>(`${API_URL}/${id}`, {
    method: "GET",
    token,
  });
}
/**
 * Update Project by ID
 */
export async function updateProject(
  id: number,
  data: Partial<CreateProjectPayload>,
  token: string
): Promise<ProjectResponse> {
  return fetcher<ProjectResponse>(`${API_URL}/${id}`, {
    method: "PUT",
    token,
    data,
  });
}
/**
 * Delete Project by ID
 */
export async function deleteProject(
  id: number,
  token: string
): Promise<{ message: string }> {
  return fetcher<{ message: string }>(`${API_URL}/${id}`, {
    method: "DELETE",
    token,
  });
}
/**
 * Get Project Report
 */
export async function getProjectReport(
  id: number,
  token: string
): Promise<ProjectReportResponse> {
  return fetcher<ProjectReportResponse>(`${API_URL}/${id}/report`, {
    method: "GET",
    token,
  });
}
/* ----------------------------------------------------
   WORKS
---------------------------------------------------- */

/**
 * Add Work to Project
 */
export async function addWorkToProject(
  projectId: number,
  data: {
    name: string;
    description?: string;
    cost: number;
    quantity: number;
    unit: string;
  },
  token: string
) {
  return fetcher<{ success: boolean }>(`${API_URL}/${projectId}/works`, {
    method: "POST",
    token,
    data,
  });
}

/**
 * Update Work
 */
export async function updateWork(
  projectId: number,
  workId: number,
  data: Partial<{
    name: string;
    description?: string;
    cost: number;
    quantity: number;
    unit: string;
  }>,
  token: string
) {
  return fetcher<{ success: boolean }>(
    `${API_URL}/${projectId}/works/${workId}`,
    {
      method: "PUT",
      token,
      data,
    }
  );
}
/**
 * Delete Work
 */
export async function deleteWork(
  projectId: number,
  workId: number,
  token: string
) {
  return fetcher<{ success: boolean }>(
    `${API_URL}/${projectId}/works/${workId}`,
    {
      method: "DELETE",
      token,
    }
  );
}
/* ----------------------------------------------------
   MATERIALS
---------------------------------------------------- */
/**
 * Add Material to Project
 */
export async function addMaterialToProject(
  projectId: number,
  data: {
    name: string;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    delivery: number;
    unit: string;
  },
  token: string
) {
  return fetcher<{ success: boolean }>(`${API_URL}/${projectId}/materials`, {
    method: "POST",
    token,
    data,
  });
}
/**
 * Update Material
 */
export async function updateMaterial(
  projectId: number,
  materialId: number,
  data: Partial<{
    name: string;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    delivery: number;
    unit: string;
  }>,
  token: string
) {
  return fetcher<{ success: boolean }>(
    `${API_URL}/${projectId}/materials/${materialId}`,
    {
      method: "PUT",
      token,
      data,
    }
  );
}
/**
 * Delete Material
 */
export async function deleteMaterial(
  projectId: number,
  materialId: number,
  token: string
) {
  return fetcher<{ success: boolean }>(
    `${API_URL}/${projectId}/materials/${materialId}`,
    {
      method: "DELETE",
      token,
    }
  );
}
