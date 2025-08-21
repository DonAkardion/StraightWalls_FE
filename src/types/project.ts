export interface Project {
  id: number;
  name: string;
  clientId: number;
  crewId: number;
  status: string; // наприклад: "В процесі", "Завершено", "Очікує запуску"
  startDate: string; // формат DD.MM.YYYY
  endDate: string;
}
