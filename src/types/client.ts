export interface Client {
  id: number;
  full_name: string;
  phone_number: string;
  objects: string[];
  created_at?: string;
  updated_at?: string;
}
