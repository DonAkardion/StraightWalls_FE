import { Project } from "next/dist/build/swc/types";

export interface ClientObject {
  id: number;
  client_id: number;
  name: string;
  address: string;
  description?: string;
}

export interface Client {
  id: number;
  full_name: string;
  phone_number: string;
  objects: ClientObject[];
  created_at?: string;
  updated_at?: string;
  projects?: Project[];
}
