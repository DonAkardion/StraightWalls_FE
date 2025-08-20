"use client";

import React, { useEffect, useState } from "react";
import { Client } from "@/types/client";

interface Props {
  client?: Client;
  onChange: (client: Omit<Client, "id" | "created_at" | "updated_at">) => void;
}

export const ClientFormModal = ({ client, onChange }: Props) => {
  const [form, setForm] = useState<
    Omit<Client, "id" | "created_at" | "updated_at">
  >(
    client || {
      full_name: "",
      phone_number: "+380",
      objects: [],
    }
  );

  useEffect(() => {
    onChange(form);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleObjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const objectsArray = value.split(",").map((obj) => obj.trim());
    setForm((prev) => ({ ...prev, objects: objectsArray }));
  };

  return (
    <>
      <label>
        <div>Ім’я</div>
        <input
          type="text"
          name="full_name"
          placeholder="Ім’я"
          value={form.full_name}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>

      <label>
        <div>Телефон</div>
        <input
          type="text"
          name="phone_number"
          placeholder="+380..."
          value={form.phone_number}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>

      <label>
        <div>Об&apos;єкти </div>
        <input
          type="text"
          name="objects"
          placeholder="Офіс, Склад, Магазин"
          value={form.objects.join(", ")}
          onChange={handleObjectsChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
    </>
  );
};
