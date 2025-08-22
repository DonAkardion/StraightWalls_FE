"use client";

import React, { useState } from "react";
import styles from "./AddCrew.module.css";
import { useRouter } from "next/navigation";
import { Crew } from "@/types/crew";
import { useCrew } from "@/features/addWorker/addWorkerContext";
import AddWorkerForm from "./AddWorkerForm/AddWorkerForm";

export default function AddCrewForm() {
  const { addCrew } = useCrew();
  const router = useRouter();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCrew: Crew = {
      id: 1,
      name,
      brigadier: null,
      status: status || null,
    };

    addCrew(newCrew);
    router.back();
  };

  return (
    <section className="max-w-[1126px] m-auto pt-[30px] px-4 sm:px-6 md:pt-[65px] md:pl-[81px] md:pr-[59px] mb-20">
      <h2 className="md:text-[28px] mb-4">Додати бригаду</h2>
      <form className={`${styles.addCrewForm} bg-white rounded-md p-5 md:p-6`}>
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
        <div className="grid md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4 mt-4">
          <label className="text-[20px] text-black">Поточний об&apos;єкт</label>
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
