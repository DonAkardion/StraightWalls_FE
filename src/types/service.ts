export interface Service {
  id: number;
  name: string;
  unit_of_measurement: string;
  price: number;
  service_type: "main" | "additional";
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
