import { Project } from "./project";

export interface InProgress {
  id: string;
  projectID: string;
  projectCrew: Project["crewId"];
  currentStage: Project["status"];
  nextStage: string;
  materialsIncome: number;
  crewSalary: number;
}
