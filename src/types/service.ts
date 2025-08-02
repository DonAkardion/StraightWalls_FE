export type ServiceType = "Основні послуги" | "Додаткові роботи";

export interface Service {
  id: string;
  name: string;
  unit: string;
  price: number;
  amount: number;
  serviceType: ServiceType;
}
