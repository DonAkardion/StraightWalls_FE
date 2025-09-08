"use client";

import React, { useEffect, useState } from "react";
import { Worker } from "@/types/worker";

interface Props {
  worker?: Worker;
  onChange: (data: Worker) => void;
}

export const CrewWorkersFormModal = ({ worker, onChange }: Props) => {
  const [form, setForm] = useState<Worker>({
    id: worker?.id ?? Date.now(),
    full_name: worker?.full_name ?? "",
    position: worker?.position ?? "",
    phone_number: worker?.phone_number ?? "",
    team_id: worker?.team_id ?? null,
  });

  useEffect(() => {
    onChange(form);
  }, [form, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <label className="block mb-3">
        <div>Ім’я</div>
        <input
          type="text"
          name="full_name"
          placeholder="Ім’я робітника"
          value={form.full_name}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>

      <label className="block mb-3">
        <div>Посада</div>
        <input
          type="text"
          name="position"
          placeholder="Будівельник, електрик..."
          value={form.position}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>

      <label className="block mb-3">
        <div>Телефон</div>
        <input
          type="text"
          name="phone_number"
          placeholder="+380501234567"
          value={form.phone_number}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
    </>
  );
};
