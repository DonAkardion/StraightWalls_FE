"use client";

import React, { useEffect, useState } from "react";
import styles from "./ExistingWorkersSelect.module.css";
import { Worker } from "@/types/worker";
import { getWorkers } from "@/api/workers";

interface ExistingWorkersSelectProps {
  selectedWorkers: Worker[];
  setSelectedWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
}

export default function ExistingWorkersSelect({
  selectedWorkers,
  setSelectedWorkers,
}: ExistingWorkersSelectProps) {
  const [allWorkers, setAllWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API getWorkers()
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Відсутній токен авторизації");
          setLoading(false);
          return;
        }

        const workers = await getWorkers(token);
        setAllWorkers(workers);
      } catch (err) {
        console.error("Помилка при завантаженні робітників:", err);
        setError("Не вдалося завантажити список робітників");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const toggleWorker = (worker: Worker) => {
    const exists = selectedWorkers.some((w) => w.id === worker.id);
    if (exists) {
      setSelectedWorkers(selectedWorkers.filter((w) => w.id !== worker.id));
    } else {
      setSelectedWorkers([...selectedWorkers, worker]);
    }
  };

  const filtered = allWorkers.filter(
    (w) =>
      w.full_name.toLowerCase().includes(search.toLowerCase()) ||
      w.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      <div className="flex justify-between items-center mb-4 mt-8 gap-2">
        <div className="text-[20px] w-full max-w-[240px] ">
          Додати робітників
        </div>

        <input
          type="text"
          placeholder="Пошук за ім'ям або посадою..."
          className={`${styles.searchInput} border-1 rounded px-5 py-[9px] w-full `}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg">
        {loading ? (
          <p>Завантаження...</p>
        ) : (
          <div
            className={`${styles.tableWrapper} rounded-lg pb-4 md:min-w-[650px] `}
          >
            <div
              className={`${styles.listHeader}  rounded-t-lg flex flex-row w-full px-8 py-5  `}
            >
              <div className="md:w-[33%] sm:w-[40%] w-full truncate">
                ПІБ Виконавця
              </div>
              <div className="sm:flex hidden text-center sm:w-[20%] md:w-[14%] truncate">
                Посада
              </div>
              <div className="md:flex hidden text-center w-[20%] truncate">
                Контакти
              </div>
              <div className="sm:flex hidden md:w-[33%] sm:w-[40%] w-full truncate">
                Бригада
              </div>
            </div>
            <ul className={`${styles.listBody} max-h-[260px] overflow-y-auto `}>
              {filtered.length === 0 ? (
                <li className="px-8 py-4 text-gray-500 text-center">
                  Робітників не знайдено
                </li>
              ) : (
                filtered.map((worker) => (
                  <li
                    key={worker.id}
                    className={`${
                      styles.workerItem
                    } flex items-center justify-between px-7  cursor-pointer hover:bg-gray-100  ${
                      selectedWorkers.some((w) => w.id === worker.id)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => toggleWorker(worker)}
                  >
                    <div
                      className={`${styles.listBodyRow} flex flex-row w-full py-5 border-b-1 `}
                    >
                      <div className="px-1 md:w-[33%] sm:w-[40%] w-full truncate">
                        {worker.full_name}
                      </div>
                      <div className="px-1 sm:flex hidden text-center md:w-[14%] sm:w-[20%] truncate">
                        {worker.position}
                      </div>
                      <div className="px-1 md:flex hidden text-center w-[20%] truncate">
                        {worker.phone_number}
                      </div>
                      <div className="px-1 sm:flex hidden md:w-[33%] sm:w-[40%] truncate">
                        {worker.team?.name || "Відсутня"}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
