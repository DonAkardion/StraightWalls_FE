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

  const [errors, setErrors] = useState<{ full_name?: string }>({});

  useEffect(() => {
    onChange(form);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // простенька валідація
    if (name === "full_name" && !value.trim()) {
      setErrors((prev) => ({ ...prev, full_name: "Ім’я є обов’язковим" }));
    } else if (name === "full_name") {
      setErrors((prev) => ({ ...prev, full_name: undefined }));
    }
  };

  const handleObjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const objectsArray = value.split(",").map((obj) => obj.trim());
    setForm((prev) => ({ ...prev, objects: objectsArray }));
  };

  return (
    <>
      <label className="block mb-3">
        <div>Ім’я</div>
        <input
          type="text"
          name="full_name"
          placeholder="Ім’я"
          value={form.full_name}
          onChange={handleChange}
          className={`border-b-1 p-2 pb-1 outline-none w-full ${
            errors.full_name ? "border-red-500" : "border-black"
          }`}
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
        )}
      </label>

      <label className="block mb-3">
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

      <label className="block mb-3">
        <div>Об&apos;єкти</div>
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
