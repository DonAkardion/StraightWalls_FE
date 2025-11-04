export interface ProjectWork {
  id: number;
  project_id?: number;
  name: string;
  description?: string;
  cost: number;
  quantity: number;
  salary: number;
  unit: string;
}

export interface ProjectMaterial {
  id: number;
  project_id: number;
  material_id: number;
  name: string;
  description?: string;
  purchase_price: string;
  selling_price: string;
  margin: string;
  estimated_quantity: string;
  delivery: string;
  unit: string;
  previous_remaining: number;
  delivery_quantity: number;
  current_remaining: number;
  additional_delivery: number;
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

export interface ProjectPayment {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  amount: number;
  status: "pending" | "paid" | "canceled";
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
}
