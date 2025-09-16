"use client";

import React, { useEffect, useState } from "react";
import styles from "./SelectedObjectInfo.module.css";
import { useUser } from "@/context/UserContextProvider";
import { getClientsObjectById } from "@/api/clients";
import { ClientObject } from "@/types/client";
import { Room, RoomType } from "@/types/rooms";

interface Props {
  objectId: number | null;
}

export const SelectedObjectInfo: React.FC<Props> = ({ objectId }) => {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [object, setObject] = useState<ClientObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!objectId || !token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getClientsObjectById(token, objectId);
        setObject(data);
      } catch (err) {
        setError("Не вдалося завантажити дані про об’єкт");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [objectId, token]);

  const ROOM_TYPE_LABELS: Record<string, string> = {
    wardrobe: "Гардероб",
    kitchen: "Кухня",
    bedroom: "Спальня",
    bedroom2: "Спальня 2",
    balcony: "Балкон",
    boiler: "Котельня",
    corridor: "Коридор",
    bathroom: "Санвузол",
    bathroom2: "Санвузол 2",
    ceiling: "Стелі",
  };

  if (!objectId) return null;
  if (loading) return <div className={styles.infoBox}>Завантаження...</div>;
  if (error)
    return <div className={`${styles.infoBox} text-red-500`}>{error}</div>;
  if (!object) return null;

  return (
    <div className={styles.infoBox}>
      {/* Статистика */}
      {object.roomStats && (
        <div className="mb-4">
          <div className={`${styles.statsTitle}`}>
            Загальна статистика об’єкта
          </div>
          <div
            className={`${styles.statsContainer} sm:p-6 p-2 grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 md:gap-6 gap-4 rounded-[5px]`}
          >
            <div
              className={`${styles.statsContainerItem}  rounded-[5px] grid grid-cols-3`}
            >
              <div
                className={`${styles.statsContainerItemTitle} rounded-[5px] p-3 flex items-center justify-center col-span-2`}
              >
                Кількість кімнат
              </div>
              <div
                className={`${styles.statsContainerItemValue} flex items-center justify-center rounded-[5px] p-3 `}
              >
                {object.roomStats.roomCount}
              </div>
            </div>
            <div
              className={`${styles.statsContainerItem}  rounded-[5px] grid grid-cols-3`}
            >
              <div
                className={`${styles.statsContainerItemTitle} rounded-[5px] p-3 flex items-center justify-center col-span-2`}
              >
                Загальна площа
              </div>
              <div
                className={`${styles.statsContainerItemValue} rounded-[5px] p-3 flex items-center justify-center `}
              >
                {object.roomStats.totalArea}
              </div>
            </div>
            <div
              className={`${styles.statsContainerItem}  rounded-[5px] grid grid-cols-3`}
            >
              <div
                className={`${styles.statsContainerItemTitle} rounded-[5px] p-3 flex items-center justify-center col-span-2`}
              >
                Відкоси
              </div>
              <div
                className={`${styles.statsContainerItemValue} p-3 flex items-center justify-center `}
              >
                {object.roomStats.totalSlopesMeters}
              </div>
            </div>
            <div
              className={`${styles.statsContainerItem}  rounded-[5px] grid grid-cols-3`}
            >
              <div
                className={`${styles.statsContainerItemTitle} p-3 rounded-[5px] flex items-center justify-center col-span-2`}
              >
                Елементи
              </div>
              <div
                className={`${styles.statsContainerItemValue} p-3 flex items-center justify-center `}
              >
                {object.roomStats.totalElementsMeters}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Кімнати */}
      <div>
        <div className={`${styles.statsTitle}`}>Кімнати</div>
        <div className="flex flex-col sm:p-6 p-2">
          <div
            className={`${styles.roomGrid} sm:grid flex flex-col  items-center 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3`}
          >
            {object.rooms.map((room: Room) => (
              <div
                className={`${styles.roomItem} w-full rounded-[5px] sm:mt-0 mt-3`}
                key={room.id}
              >
                <div className={`${styles.roomItemName} rounded-t-[5px]`}>
                  <div className=" px-2 py-1 text-center">
                    {ROOM_TYPE_LABELS[room.type] || room.type}
                  </div>
                </div>
                <div className="flex items-center justify-between px-2 py-1">
                  <div>Площа:</div> <div>{room.area}</div>
                </div>
                <div className="flex items-center justify-between px-2 py-1">
                  <div>м.п. Відкосів:</div>
                  <div>{room.slopes_linear_meters}</div>
                </div>
                <div className="flex items-center justify-between px-2 py-1">
                  <div>м.п. Елементів:</div>{" "}
                  <div>{room.elements_linear_meters}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
