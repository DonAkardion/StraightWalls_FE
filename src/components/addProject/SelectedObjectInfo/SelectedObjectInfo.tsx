"use client";

import React, { useEffect, useState } from "react";
import styles from "./SelectedObjectInfo.module.css";
import { useUser } from "@/context/UserContextProvider";
import { getClientsObjectById } from "@/api/clients";
import { ClientObject } from "@/types/client";
import { Room } from "@/types/rooms";

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
  const formatValue = (value: number | string) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    return Number(num.toFixed(1));
  };
  if (!objectId) return null;
  if (loading) return <div className={styles.infoBox}>Завантаження...</div>;
  if (error)
    return <div className={`${styles.infoBox} text-red-500`}>{error}</div>;
  if (!object) return null;

  const filteredRooms = object.rooms.filter((room: Room) => {
    const area = Number(room.area) || 0;
    const slopes = Number(room.slopes_linear_meters) || 0;
    const elements = Number(room.elements_linear_meters) || 0;
    return area > 0 || slopes > 0 || elements > 0;
  });

  return (
    <div className={styles.infoBox}>
      {/* Статистика */}
      {object.roomStats && (
        <div className="mb-4">
          <div className={styles.statsTitle}>Загальна статистика об’єкта</div>
          <div
            className={`
    ${styles.statsContainer}
    sm:p-6 p-2
    grid
    gap-4
    rounded-[5px]

    xl:grid-cols-3
    lg:grid-cols-2
    grid-cols-1
  `}
          >
            {[
              {
                label: "Площа кімнат",
                value: object.roomStats.regularRoomsArea,
              },
              {
                label: "Відкоси",
                value: object.roomStats.regularRoomsSlopesMeters,
              },
              {
                label: "Елементи",
                value: object.roomStats.regularRoomsElementsMeters,
              },
              {
                label: "Площа Санвузлів",
                value: object.roomStats.bathroomArea,
              },
              {
                label: "Відкоси Санвузлів",
                value: object.roomStats.bathroomSlopesMeters,
              },
              {
                label: "Елементи Санвузлів",
                value: object.roomStats.bathroomElementsMeters,
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`${styles.statsContainerItem} rounded-[5px] grid grid-cols-3`}
                style={{
                  gridRow:
                    window.innerWidth >= 1024 && window.innerWidth < 1280
                      ? `${(idx % 3) + 1}`
                      : "auto",
                  gridColumn:
                    window.innerWidth >= 1024 && window.innerWidth < 1280
                      ? `${Math.floor(idx / 3) + 1}`
                      : "auto",
                }}
              >
                <div
                  className={`${styles.statsContainerItemTitle} p-3 flex items-center justify-center text-center col-span-2 rounded-l-[5px]`}
                >
                  {stat.label}
                </div>
                <div
                  className={`${styles.statsContainerItemValue} flex items-center justify-center p-3`}
                >
                  {formatValue(stat.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Кімнати */}
      {/* {filteredRooms.length > 0 && (
        <div>
          <div className={styles.statsTitle}>Кімнати</div>
          <div className="flex flex-col sm:p-6 p-2">
            <div
              className={`${styles.roomGrid} sm:grid flex flex-col items-center 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3`}
            >
              {filteredRooms.map((room: Room) => (
                <div
                  className={`${styles.roomItem} w-full rounded-[5px] sm:mt-0 mt-3`}
                  key={room.id}
                >
                  <div className={`${styles.roomItemName} rounded-t-[5px]`}>
                    <div className="px-2 py-1 text-center">
                      {ROOM_TYPE_LABELS[room.type] || room.type}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1">
                    <div>Площа:</div> <div>{formatValue(room.area)}</div>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1">
                    <div>м.п. Відкосів:</div>
                    <div>{formatValue(room.slopes_linear_meters)}</div>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1">
                    <div>м.п. Елементів:</div>
                    <div>{formatValue(room.elements_linear_meters)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};
