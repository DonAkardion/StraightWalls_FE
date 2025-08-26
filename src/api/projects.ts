import { fetcher } from "@/utils/fetcher";
import type { CreateProjectPayload } from "@/types/сreateProjectPayload";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createProject(data: CreateProjectPayload, token: string) {
  return fetcher<{ success: boolean; projectId: number }>(
    `${API_BASE}/api/projects/complete`,
    {
      method: "POST",
      data,
      token,
    }
  );
}
