export interface CreateProjectPayload {
  project: {
    name: string;
    description?: string;
    client_id: string;
    object_id: string | null;
    team_id: string;
    status: string;
  };
  initial_payment?: {
    name: string;
    description?: string;
    amount: string;
    status: "pending" | "paid" | "canceled";
    due_date: string;
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
    description?: string;
    purchase_price: string;
    selling_price: string;
    remaining_stock: string;
    delivery: string;
    unit: string;
  }[];
}
