export interface Project {
  id: string;
  name: string;
  clientId: string; // посилання на клієнта
  crewId: string; // посилання на бригаду
  status: string; // наприклад: "В процесі", "Завершено", "Очікує запуску"
  startDate: string; // формат DD.MM.YYYY
  endDate: string; // формат DD.MM.YYYY
}
