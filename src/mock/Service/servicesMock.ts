export type ServiceType = "Основні послуги" | "Додаткові роботи";

export interface Service {
  id: string;
  name: string;
  unit: string;
  amount: number;
  serviceType: ServiceType;
  price: number;
}

export const mockServices: Service[] = [
  {
    id: "1",
    name: "Штукатурка стін цп сумішами 1",
    unit: "м2, м.лог.в",
    amount: 10,
    serviceType: "Основні послуги",
    price: 229,
  },
  {
    id: "2",
    name: "Штукатурка стін цп сумішами 2",
    unit: "м2, м.лог.в",
    amount: 15,
    serviceType: "Основні послуги",
    price: 245,
  },
  {
    id: "3",
    name: "Штукатурка стін гіпсова 1",
    unit: "м2",
    amount: 20,
    serviceType: "Основні послуги",
    price: 234,
  },
  {
    id: "4",
    name: "Штукатурка стін гіпсова 2",
    unit: "м2",
    amount: 17,
    serviceType: "Основні послуги",
    price: 220,
  },
  {
    id: "5",
    name: "Штукатурка стін гіпсова 3",
    unit: "м2",
    amount: 17,
    serviceType: "Основні послуги",
    price: 238,
  },
  {
    id: "6",
    name: "Штукатурка стін цп сумішами 3",
    unit: "м2, м.лог.в",
    amount: 10,
    serviceType: "Додаткові роботи",
    price: 212,
  },
  {
    id: "7",
    name: "Штукатурка стін цп сумішами 4",
    unit: "м2, м.лог.в",
    amount: 15,
    serviceType: "Додаткові роботи",
    price: 247,
  },
  {
    id: "8",
    name: "Штукатурка стін гіпсова 4",
    unit: "м2",
    amount: 20,
    serviceType: "Додаткові роботи",
    price: 227,
  },
  {
    id: "9",
    name: "Штукатурка стін гіпсова 5",
    unit: "м2",
    amount: 17,
    serviceType: "Додаткові роботи",
    price: 210,
  },
  {
    id: "10",
    name: "Штукатурка стін гіпсова 6",
    unit: "м2",
    amount: 17,
    serviceType: "Додаткові роботи",
    price: 232,
  },
  {
    id: "11",
    name: "Штукатурка стін цп сумішами 5",
    unit: "м2, м.лог.в",
    amount: 10,
    serviceType: "Основні послуги",
    price: 249,
  },
  {
    id: "12",
    name: "Штукатурка стін цп сумішами 6",
    unit: "м2, м.лог.в",
    amount: 15,
    serviceType: "Основні послуги",
    price: 219,
  },
  {
    id: "13",
    name: "Штукатурка стін гіпсова 7",
    unit: "м2",
    amount: 20,
    serviceType: "Основні послуги",
    price: 231,
  },
  {
    id: "14",
    name: "Штукатурка стін гіпсова 8",
    unit: "м2",
    amount: 17,
    serviceType: "Додаткові роботи",
    price: 241,
  },
  {
    id: "15",
    name: "Штукатурка стін гіпсова 9",
    unit: "м2",
    amount: 17,
    serviceType: "Додаткові роботи",
    price: 216,
  },
];
