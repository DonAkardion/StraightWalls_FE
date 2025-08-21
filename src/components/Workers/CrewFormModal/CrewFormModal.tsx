"use client";

import React, { useEffect, useState } from "react";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import styles from "./CrewFormModal.module.css";

interface CrewFormModalProps {
  initialData?: Crew;
  onSubmit: (data: Crew) => void;
  onClose: () => void;
  workers: Worker[];
}

export function CrewFormModal({
  initialData,

  workers,
}: CrewFormModalProps) {
  const [formData, setFormData] = useState<Crew>(
    initialData ?? {
      id: 1, // change later
      name: "",
      brigadier: null,
      status: "active",
    }
  );

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      <div className={`${styles.ModalInputTytle}`}>Назва</div>
      <input
        type="text"
        name="name"
        placeholder="Назва"
        value={formData.name}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />
      <div className={`${styles.ModalInputTytle}`}>Оберіть бригадира</div>
      <select
        className="appearance-none border-b-1 p-2 pb-1 outline-none"
        name="brigadier"
        value={formData.brigadier?.id || ""}
        // onChange={(e) => {
        //   const selectedWorker = null
        //     workers.find((w) => w.id === e.target.value) || null;
        //   setFormData({ ...formData, brigadier: selectedWorker });
        // }}
      >
        {workers.map((worker) => (
          <option key={worker.id} value={worker.id}>
            {worker.name}
          </option>
        ))}
      </select>
      <div className={`${styles.ModalInputTytle}`}>Статус</div>
      <input
        type="text"
        name="status"
        placeholder="Статус"
        value={formData.status ?? ""}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />
    </div>
  );
}
