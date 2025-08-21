import { Project } from "./project";

export interface InProgress {
  id: number;
  projectID: string;
  projectCrew: Project["crewId"];
  currentStage: Project["status"];
  nextStage: string;
  materialsIncome: number;
  crewSalary: number;
}
