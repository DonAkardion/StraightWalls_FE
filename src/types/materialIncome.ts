export type ServiceType = "Основні послуги" | "Додаткові роботи";

export interface MaterialIncome {
  id: string;
  name: string;
  price: string;
  amount: number;
  income: string;
  area: string;
  serviceType: ServiceType;
}
