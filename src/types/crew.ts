import { Worker } from "./worker";

export interface Crew {
  id: string;
  name: string;
  brigadier: Worker | null;
  status?: string | null;
}
