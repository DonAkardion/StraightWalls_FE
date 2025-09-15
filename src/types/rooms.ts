export interface Room {
  id: number;
  client_object_id: number;
  type: RoomType;
  area: number;
  slopes_linear_meters: number;
  elements_linear_meters: number;
}

export interface RoomResponce {
  status: string;
  data: Room[];
}

export interface RoomDraft {
  client_object_id: number;
  type: RoomType;
  area: number;
  slopes_linear_meters: number;
  elements_linear_meters: number;
}

export enum RoomType {
  WARDROBE = "wardrobe", // Гардероб
  KITCHEN = "kitchen", // Кухня
  BEDROOM = "bedroom", // Спальня
  BEDROOM2 = "bedroom2", // Спальня2
  BALCONY = "balcony", // Балкон
  BOILER = "boiler", // Котельня
  CORRIDOR = "corridor", // Коридор
  BATHROOM = "bathroom", // Санвузол
  BATHROOM2 = "bathroom2", // Санвузол2
  CEILING = "ceiling", // Стелі
}
