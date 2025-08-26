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
  purchase_price: number;
  selling_price: number;
  quantity: number;
  remaining_stock: number;
  delivery: number;
  unit: string;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface MaterialIncomeRow {
  id: number;
  name: string;
  description?: string;
  unit?: string;
  quantity: number;
  sum: number; // продажна сума з доставкою
  income: number; // заробіток
}
