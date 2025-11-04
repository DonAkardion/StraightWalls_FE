export interface Material {
  id: number;
  name: string;
  description?: string;
  base_purchase_price: number;
  base_selling_price: number;
  base_margin: number;
  unit: string;
  stock: number;
  base_delivery: number;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialFormData {
  id: number;
  name: string;
  description?: string;
  purchase_price: number;
  selling_price: number;
  delivery: number;
  unit: string;
  previous_remaining: number;
  estimated_quantity: number;
  current_remaining: number;
  delivery_quantity?: number | string;
  additional_delivery: number;
}

export interface TableMaterial {
  id: number;
  name: string;
  unit?: string;
  base_purchase_price: number | string;
  base_selling_price: number | string;
  base_delivery: number | string;
  estimated_quantity?: number | string;
  previous_remaining?: number | string;
  current_remaining?: number | string;
  delivery_quantity?: number | string;
  additional_delivery?: number | string;
  description?: string | null;
  [key: string]: any;
}
