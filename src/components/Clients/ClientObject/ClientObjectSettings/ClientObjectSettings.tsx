"use client";

import React, { useState, useEffect } from "react";
import styles from "./ClientObjectSettings.module.css";
import { useUser } from "@/context/UserContextProvider";
import { ClientObject } from "@/types/client";
import { SettingsTable } from "@/components/Clients/ClientObject/ClientObjectSettings/SettingsTable";
import { getObjectRooms, updateRoom, createRoom } from "@/api/rooms";
import { Room, RoomType, RoomDraft } from "@/types/rooms";

interface Props {
  objectId: number;
}

export function ClientObjectSettings({ objectId }: Props) {
  const { token } = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [areaTotals, setAreaTotals] = useState<number[]>([]);
  const [slopesTotals, setSlopesTotals] = useState<number[]>([]);
  const [elementsTotals, setElementsTotals] = useState<number[]>([]);

  const columns = [
    "Гардероб",
    "Кухня",
    "Спальня",
    "Спальня2",
    "Балкон",
    "Котельня",
    "Коридор",
    "Санвузол",
    "Санвузол2",
    "Стелі",
  ];

  const ROOM_TYPE_LABELS: Record<RoomType, string> = {
    [RoomType.WARDROBE]: "Гардероб",
    [RoomType.KITCHEN]: "Кухня",
    [RoomType.BEDROOM]: "Спальня",
    [RoomType.BEDROOM2]: "Спальня2",
    [RoomType.BALCONY]: "Балкон",
    [RoomType.BOILER]: "Котельня",
    [RoomType.CORRIDOR]: "Коридор",
    [RoomType.BATHROOM]: "Санвузол",
    [RoomType.BATHROOM2]: "Санвузол2",
    [RoomType.CEILING]: "Стелі",
  };

  const fetchRooms = async () => {
    if (!token) return;
    try {
      const res = await getObjectRooms(objectId, token);
      setRooms(res?.data || []);
    } catch (err) {
      console.error("Не вдалося отримати кімнати:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [objectId, token]);

  const areas = columns.map(
    (col) => rooms.find((r) => ROOM_TYPE_LABELS[r.type] === col)?.area ?? null
  );

  const slopes = columns.map(
    (col) =>
      rooms.find((r) => ROOM_TYPE_LABELS[r.type] === col)
        ?.slopes_linear_meters ?? null
  );

  const elements = columns.map(
    (col) =>
      rooms.find((r) => ROOM_TYPE_LABELS[r.type] === col)
        ?.elements_linear_meters ?? null
  );

  const handleSaveAll = async () => {
    if (!token) return;

    try {
      await Promise.all(
        columns.map(async (col, idx) => {
          const room = rooms.find((r) => ROOM_TYPE_LABELS[r.type] === col);

          const area = areaTotals[idx] ?? 0;
          const slopesVal = slopesTotals[idx] ?? 0;
          const elementsVal = elementsTotals[idx] ?? 0;

          // Якщо немає жодних змін → пропускаємо
          if (
            room &&
            room.area === area &&
            room.slopes_linear_meters === slopesVal &&
            room.elements_linear_meters === elementsVal
          ) {
            return;
          }

          if (room) {
            // 🔹 update
            await updateRoom(
              room.id,
              {
                area,
                slopes_linear_meters: slopesVal,
                elements_linear_meters: elementsVal,
              },
              token
            );
          } else {
            // 🔹 create
            if (area > 0 || slopesVal > 0 || elementsVal > 0) {
              const type = Object.keys(ROOM_TYPE_LABELS).find(
                (key) => ROOM_TYPE_LABELS[key as RoomType] === col
              ) as RoomType;

              await createRoom(
                {
                  client_object_id: objectId,
                  type,
                  area,
                  slopes_linear_meters: slopesVal,
                  elements_linear_meters: elementsVal,
                },
                token
              );
            }
          }
        })
      );

      await fetchRooms();

      setAreaTotals([]);
      setSlopesTotals([]);
      setElementsTotals([]);
    } catch (err) {
      console.error("Помилка збереження:", err);
      alert("Помилка при збереженні");
    }
  };

  if (loading) return <div>Завантаження...</div>;
  return (
    <section
      className={`${styles.objectTableSection} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div className="flex justify-between mt-6">
        <div className={`${styles.objectTableTitle} mb-[16px]`}>Параметри</div>
        <button
          onClick={handleSaveAll}
          className="px-6 py-2 h-[40px] bg-green-500 text-white rounded hover:bg-green-600"
        >
          Зберегти всі дані
        </button>
      </div>

      <div className={`${styles.objectTableContainer}`}>
        <div className={`${styles.containerItem}`}>
          <div className={`${styles.containerItemTitle} mb-[8px] ml-[8px]`}>
            Загальна таблиця
          </div>
          <SettingsTable
            columns={columns}
            initialValues={areas}
            onTotalsChange={setAreaTotals}
          />

          <div className={`${styles.containerItemTitle} mb-[8px] ml-[8px]`}>
            Метри Погонні Відкосів
          </div>
          <SettingsTable
            columns={columns}
            initialValues={slopes}
            onTotalsChange={setSlopesTotals}
          />

          <div className={`${styles.containerItemTitle} mb-[8px] ml-[8px]`}>
            Метри Погонні
          </div>
          <SettingsTable
            columns={columns}
            initialValues={elements}
            onTotalsChange={setElementsTotals}
          />
        </div>
      </div>
    </section>
  );
}
