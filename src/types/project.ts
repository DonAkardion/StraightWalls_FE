export interface Project {
  id: string;
  name: string;
  clientId: string;
  crewId: string;
  status: string; // наприклад: "В процесі", "Завершено", "Очікує запуску"
  startDate: string; // формат DD.MM.YYYY
  endDate: string;
}
