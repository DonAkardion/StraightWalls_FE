
import { Room, RoomStats } from "@/types/rooms";
import { Project } from "./project";

export interface ClientObject {
  id: number;
  client_id: number;
  name: string;
  address: string;
  description?: string;
  rooms: Room[];
  roomStats: RoomStats;
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
