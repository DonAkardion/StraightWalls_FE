export interface Service {
  id: number;
  name: string;
  unit_of_measurement: string;
  price: number;
  service_type?: "main" | "additional";
  description?: string;
  salary: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TableService {
  id: number;
  name: string;
  unit_of_measurement?: string;
  price: number | string;
  service_type: "main" | "additional";
  remaining_stock?: number | string;
  previous_remaining?: number | string;
  current_remaining?: number | string;
  additional_delivery?: number | string;
  description?: string | null;
  [key: string]: any;
}
