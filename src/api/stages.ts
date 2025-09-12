import { fetcher } from "@/utils/fetcher";
import { Project } from "@/types/project";
import { ProjectStage, StageStatus } from "@/types/stages";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface StageResponse {
  status: string;
  message: string;
  data: Project;
}

/**
 * Update Stage
 */
export async function updateProjectStage(
  projectId: number,
  data: StageStatus,
  token: string
) {
  return fetcher<StageResponse>(
    `${API_BASE}/api/projects/${projectId}/stages`,
    {
      method: "PATCH",
      token,
      data,
    }
  );
}
