export interface CreateProjectPayload {
  project: {
    name: string;
    description?: string;
    client_id: string;
    team_id: string;
    status: string;
  };
  works: {
    name: string;
    description?: string;
    cost: string;
    quantity: string;
    unit: string;
  }[];
  materials: {
    name: string;
    purchase_price: string;
    selling_price: string;
    remaining_stock: string;
    delivery: string;
    unit: string;
  }[];
}
