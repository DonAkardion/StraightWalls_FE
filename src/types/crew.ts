import { Worker } from "./worker";

export interface Crew {
  id: number;
  name: string;
  brigadier: Worker | null;
  status?: string | null;
}
