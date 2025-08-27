import { Project } from "./project";

export interface InProgress {
  id: number;
  projectID: string;
  projectCrew: Project["team_id"];
  currentStage: Project["status"];
  nextStage: string;
  materialsIncome: number;
  crewSalary: number;
}
