import { ProjectWork, ProjectMaterial } from "@/types/projectComponents";

export interface Project {
  id: number;
  name: string;
  description?: string;
  client_id: number;
  team_id: number;
  status: ProjectStatus;
  works: ProjectWork[];
  materials: ProjectMaterial[];
  created_at: string;
  updated_at: string;
}

export enum ProjectStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
