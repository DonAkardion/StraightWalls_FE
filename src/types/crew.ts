import { Client } from "./client";

export interface Crew {
  id: number;
  name: string;
  status: string | null;
  projects?: { name: string; id: number; start_date?: string; end_date?: string }[];
  selected?: boolean;
  client?: Client;
}
