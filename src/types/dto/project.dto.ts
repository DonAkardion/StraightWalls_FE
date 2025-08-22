export interface CreateProjectDto {
  name: string;
  description?: string;
  client_id: number;
  team_id: number;
  services: {
    service_id: number;
    quantity: number;
  }[];
}
