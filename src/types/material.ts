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
