export interface Crew {
  id: number;
  name?: string;
  status?: string | null;
  projects?: { name: string, id: number }[];
}
