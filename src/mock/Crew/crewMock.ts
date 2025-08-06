import { Crew } from "@/types/crew";
import { mockWorkers } from "@/mock/Workers/workersMock";

export const mockCrews: Crew[] = [
  {
    id: "101",
    name: "Ств Гаркуша",
    brigadier: mockWorkers[0],
    status: "Об’єкт №123",
  },
  {
    id: "102",
    name: "Ств Бойко",
    brigadier: mockWorkers[1],
    status: "Об’єкт №256",
  },
  {
    id: "103",
    name: "Ств Іванчук",
    brigadier: mockWorkers[2],
    status: null,
  },
  {
    id: "104",
    name: "Ств Коваленко",
    brigadier: mockWorkers[3],
    status: "Об’єкт №417",
  },
  {
    id: "105",
    name: "Ств Мельник",
    brigadier: mockWorkers[5],
    status: null,
  },
  {
    id: "106",
    name: "Ств Руденко",
    brigadier: mockWorkers[6],
    status: "Об’єкт №512",
  },
  {
    id: "107",
    name: "Ств Шевченко",
    brigadier: mockWorkers[7],
    status: "Об’єкт №623",
  },
  {
    id: "108",
    name: "Ств Петренко",
    brigadier: mockWorkers[8],
    status: null,
  },
  {
    id: "109",
    name: "Ств Козак",
    brigadier: null,
    status: "Об’єкт №700",
  },
  {
    id: "110",
    name: "Ств Дяченко",
    brigadier: null,
    status: null,
  },
];
