export interface ProjectWork {
  id: number;
  project_id?: number;
  name: string;
  description?: string;
  cost: number;
  quantity: number;
  unit: string;
}

export interface ProjectMaterial {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  cost: number;
  quantity: number;
  unit: string;
  unit_price: number;
  created_at: string;
  updated_at: string;
}
