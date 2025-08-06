"use client";

import React, { useEffect, useState } from "react";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";

interface CrewFormModalProps {
  initialData?: Crew;
  onSubmit: (data: Crew) => void;
  onClose: () => void;
  workers: Worker[];
}

export function CrewFormModal({
  initialData,
  onSubmit,
  onClose,
  workers,
}: CrewFormModalProps) {
  const [formData, setFormData] = useState<Crew>(
    initialData ?? {
      id: crypto.randomUUID(),
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

  const handleSave = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Назва"
        value={formData.name}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />
      <select
        className="border rounded px-2 py-1"
        name="brigadier"
        value={formData.brigadier?.id || ""}
        onChange={(e) => {
          const selectedWorker =
            workers.find((w) => w.id === e.target.value) || null;
          setFormData({ ...formData, brigadier: selectedWorker });
        }}
      >
        <option value="">Оберіть бригадира</option>
        {workers.map((worker) => (
          <option key={worker.id} value={worker.id}>
            {worker.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="status"
        placeholder="Статус"
        value={formData.status ?? ""}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
