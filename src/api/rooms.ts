import { fetcher } from "@/utils/fetcher";
import { RoomDraft, RoomResponce, Room } from "@/types/rooms";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// 1. Create New Room
export async function createRoom(
  data: RoomDraft,
  token: string
): Promise<RoomResponce> {
  return fetcher<RoomResponce>(`${API_BASE}/api/rooms`, {
    method: "POST",
    data,
    token,
  });
}

// 2. GetAllObjectRooms by object ID
export async function getObjectRooms(
  objectId: number,
  token: string
): Promise<RoomResponce> {
  return fetcher<RoomResponce>(`${API_BASE}/api/rooms/object/${objectId}`, {
    token,
  });
}

export async function updateRoom(
  id: number,
  data: Partial<Omit<RoomDraft, "client_object_id" | "type">>,
  token: string
): Promise<Room> {
  return fetcher<Room>(`${API_BASE}/api/rooms/${id}`, {
    method: "PUT",
    data,
    token,
  });
}

// 6. DELETE Room
export async function deleteRoom(id: number, token: string): Promise<void> {
  return fetcher<void>(`${API_BASE}/api/rooms/${id}`, {
    method: "DELETE",
    token,
  });
}
