"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./AddCrew.module.css";
import { useRouter } from "next/navigation";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { useCrew } from "@/features/addWorker/addWorkerContext";
import AddWorkerForm from "./AddWorkerForm/AddWorkerForm";

export default function AddCrewForm() {
  const { addCrew, workers } = useCrew();
  const router = useRouter();

  const [name, setName] = useState("");
  const [brigadierSearch, setBrigadierSearch] = useState("");
  const [selectedBrigadier, setSelectedBrigadier] = useState<Worker | null>(null);
  const [status, setStatus] = useState("");
  const [showList, setShowList] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredWorkers = workers.filter((w) =>
    w.name.toLowerCase().includes(brigadierSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCrew: Crew = {
      id: Date.now().toString(),
      name,
      brigadier: selectedBrigadier,
      status: status || null,
    };

    addCrew(newCrew);
    router.back();
  };

  const handleSelect = (worker: Worker) => {
    setSelectedBrigadier(worker);
    setBrigadierSearch(worker.name);
    setShowList(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="
        max-w-[1126px] 
        m-auto 
        pt-[30px] 
        px-4 
        sm:px-6 
        md:pt-[65px] 
        md:pl-[81px] 
        md:pr-[59px] 
        mb-20
      ">
      <h2 className="md:text-[28px] mb-4">Додати бригаду</h2>
      <form
        className={`${styles.addCrewForm} bg-white rounded-md p-5 md:p-6`}
      >
        <div className="grid md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
          <label className="text-[20px] text-black">Назва бригади</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть назву"
            className={`${styles.addCrewInput} h-10 md:h-11 rounded border border-black px-5 text-[16px]`}
          />
        </div>
        <div className="grid md:grid-cols-[180px_1fr] items-start gap-2 md:gap-4 mt-4 relative" ref={containerRef}>
          <label className="text-[20px] text-black">Бригадир</label>
          <div className="flex flex-col relative">
            <input
              type="text"
              value={brigadierSearch}
              onChange={(e) => {
                setBrigadierSearch(e.target.value);
                setSelectedBrigadier(null);
                setShowList(true);
              }}
              onFocus={() => setShowList(true)}
              placeholder="Введіть ПІБ"
              className={`${styles.addCrewInput} h-10 md:h-11 rounded border border-black px-5 text-[16px]`}
            />
            {showList && filteredWorkers.length > 0 && (
              <ul className="absolute left-0 top-full w-full border border-black rounded bg-white max-h-40 overflow-y-auto z-10">
                {filteredWorkers.map((worker) => (
                  <li
                    key={worker.id}
                    onClick={() => handleSelect(worker)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {worker.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4 mt-4">
          <label className="text-[20px] text-black">Поточний об'єкт</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Введіть статус"
            className={`${styles.addCrewInput} h-10 md:h-11 rounded border border-black px-5 text-[16px]`}
          />
        </div>
        <AddWorkerForm />
      </form>
      <div className="mt-10">
          <button
            type="button"
            onClick={handleSubmit}
            className={`${styles.addCrewButton} cursor-pointer w-full h-12 md:h-[54px] rounded-md text-[18px] text-black transition`}
          >
            Додати
          </button>
        </div>
    </section>
  );
}
