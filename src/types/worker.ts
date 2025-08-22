export interface Worker {
  id: number;
  full_name: string;
  position: string;
  phone_number: string;
  team_id: number | null;
  created_at?: string;
  updated_at?: string;
  team?: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}
