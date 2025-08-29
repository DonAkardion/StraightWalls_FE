import {
  ProjectWork,
  ProjectMaterial,
  ProjectPayment,
} from "@/types/projectComponents";

import { Client, ClientObject } from "@/types/client";

import { Crew } from "@/types/crew";

export interface Project {
  id: number;
  name: string;
  description?: string;
  client_id: number;
  team_id: number;
  status: ProjectStatus;
  works: ProjectWork[];
  materials: ProjectMaterial[];
  payments: ProjectPayment[];
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export enum ProjectStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface ProjectResponse {
  id: number;
  name: string;
  client_id: number;
  team_id: number;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectReportResponse {
  project: {
    id: number;
    name: string;
    description?: string | null;
    client_id: number;
    team_id: number;
    status: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    client: Client;
    object: ClientObject;
    team: Crew;
    works: ProjectWork[];
    materials: ProjectMaterial[];
    payments: ProjectPayment[];
  };
  totalWorksCost: number;
  totalMaterialsCost: number;
  totalMaterialsProfit: number;
  totalProjectCost: number;
  validWorksCount: number;
}

export interface ProjectDetailedResponse {
  id: number;
  name: string;
  description: string | null;
  client_id: number;
  team_id: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;

  client: {
    id: number;
    full_name: string;
    phone_number: string;
    objects: string[];
    created_at: string;
    updated_at: string;
  };

  team: {
    id: number;
    name: string;
    status: "busy" | "available";
    created_at: string;
    updated_at: string;
  };

  works: {
    id: number;
    project_id: number;
    name: string;
    description: string;
    cost: string;
    quantity: string;
    unit: string;
    created_at: string;
    updated_at: string;
  }[];

  materials: {
    id: number;
    project_id: number;
    name: string;
    description: string | null;
    purchase_price: string;
    selling_price: string;
    margin: string;
    remaining_stock: string;
    delivery: string;
    unit: string;
    created_at: string;
    updated_at: string;
  }[];
  payments: {
    id: number;
    project_id: number;
    name: string;
    description?: string;
    amount: number;
    status: "pending";
    due_date?: Date;
    created_at: Date;
    updated_at: Date;
  };
}
