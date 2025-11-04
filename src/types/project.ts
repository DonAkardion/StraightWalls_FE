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
  is_thinking: boolean;
  is_confirmed: boolean;
  is_rejected: boolean;
  is_scheduled: boolean;
  is_keys_and_advance: boolean;
  is_order_materials: boolean;
  is_in_progress: boolean;
  is_completed: boolean;
  is_all_calculated: boolean;
  works: ProjectWork[];
  materials: ProjectMaterial[];
  payments: ProjectPayment[];
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export enum ProjectStatus {
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  NEW = "new",
  CANCELED = "canceled",
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  client_id?: number;
  object_id?: number;
  team_id?: number;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
  universal_material_price_per_m2?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  client_id: number;
  team_id: number;
  status: string;
  is_thinking: boolean;
  is_confirmed: boolean;
  is_rejected: boolean;
  is_scheduled: boolean;
  is_keys_and_advance: boolean;
  is_order_materials: boolean;
  is_in_progress: boolean;
  is_completed: boolean;
  is_all_calculated: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  materials: ProjectMaterial[];
}

export interface ProjectReportResponse {
  project: {
    id: number;
    name: string;
    description?: string | null;
    client_id: number;
    team_id?: number;
    status: string;
    is_works_confirmed: boolean;
    is_start_date_agreed: boolean;
    is_team_assigned: boolean;
    is_keys_received: boolean;
    is_materials_prepaid: boolean;
    is_materials_ordered: boolean;
    is_team_started: boolean;
    is_details_clarified: boolean;
    is_work_accepted: boolean;
    is_work_delivered: boolean;
    is_final_payment_received: boolean;
    is_team_paid: boolean;
    start_date: string;
    end_date: string;
    universal_material_price_per_m2: string | null;
    universal_material_total: string | null;
    created_at: string;
    updated_at: string;
    client: Client;
    object: ClientObject;
    team?: Crew;
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
  start_date: string;
  end_date: string;
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
    estimated_quantity: string;
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
    status: "pending" | "paid" | "canceled";
    due_date?: Date;
    created_at: Date;
    updated_at: Date;
  };
}

export interface UpdateMaterialRequest {
  purchase_price: number;
  previous_remaining: number;
  estimated_quantity: number;
  current_remaining: number;
  additional_delivery: number;
}

export interface UpdateWorkRequest {
  quantity: number;
  cost: number;
}
