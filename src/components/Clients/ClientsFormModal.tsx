"use client";

import React, { useEffect, useState } from "react";
import { Client, ClientObject } from "@/types/client";

interface Props {
  client?: Client;
  onChange: (client: {
    full_name: string;
    phone_number: string;
    object: Pick<ClientObject, "name" | "address" | "description">;
  }) => void;
}

export const ClientFormModal = ({ client, onChange }: Props) => {
  const [form, setForm] = useState({
    full_name: client?.full_name || "",
    phone_number: client?.phone_number || "+380",
    object: {
      name: "",
      address: "",
      description: "",
    },
  });

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

  const handleObjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      object: {
        ...prev.object,
        [name]: value,
      },
    }));
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
        <div>Назва Об`єкту</div>
        <input
          type="text"
          name="name"
          placeholder="Квартира, Офіс..."
          value={form.object.name}
          onChange={handleObjectChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
      <label className="block mb-3">
        <div>Адреса</div>
        <input
          type="text"
          name="address"
          placeholder="вул. Шевченка, 10"
          value={form.object.address}
          onChange={handleObjectChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
      <label className="block mb-3">
        <div>Опис</div>
        <input
          type="text"
          name="description"
          placeholder="Двокімнатна квартира..."
          value={form.object.description}
          onChange={handleObjectChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
    </>
  );
};
