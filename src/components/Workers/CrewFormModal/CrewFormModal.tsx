"use client";

import React, { useEffect, useState } from "react";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import styles from "./CrewFormModal.module.css";

interface CrewFormModalProps {
  initialData?: Crew;
  onChange: (data: Crew) => void;
  workers: Worker[];
}

export function CrewFormModal({
  initialData,
  onChange,
  workers,
}: CrewFormModalProps) {
  const [formData, setFormData] = useState<Crew>(
    initialData ?? { id: 0, name: "", status: "" }
  );

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    onChange({ ...updated });
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
    </div>
  );
}
