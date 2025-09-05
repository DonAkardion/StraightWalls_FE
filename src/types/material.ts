export interface Material {
  id: number;
  name: string;
  description?: string;
  base_purchase_price: string;
  base_selling_price: string;
  base_margin: string;
  unit: string;
  stock: string;
  base_delivery: string;
  created_at?: string;
  updated_at?: string;
}
