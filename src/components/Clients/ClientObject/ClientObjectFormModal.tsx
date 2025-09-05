"use client";

import React, { useEffect, useState } from "react";
import { ClientObject } from "@/types/client";

interface Props {
  object?: ClientObject;
  onChange: (
    data: Pick<ClientObject, "name" | "address" | "description">
  ) => void;
}

export const ClientObjectFormModal = ({ object, onChange }: Props) => {
  const isEdit = Boolean(object);

  const [form, setForm] = useState<
    Pick<ClientObject, "name" | "address" | "description">
  >({
    name: object?.name ?? "",
    address: object?.address ?? "",
    description: object?.description ?? "",
  });

  useEffect(() => {
    if (object) {
      setForm({
        name: object.name ?? "",
        address: object.address ?? "",
        description: object.description ?? "",
      });
    } else {
      setForm({ name: "", address: "", description: "" });
    }
  }, [object]);

  useEffect(() => {
    onChange(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <label className="block mb-3">
        <div>Назва об’єкту</div>
        <input
          type="text"
          name="name"
          placeholder="Квартира, офіс..."
          value={form.name}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>

      <label className="block mb-3">
        <div>Адреса</div>
        <input
          type="text"
          name="address"
          placeholder="вул. Шевченка, 10"
          value={form.address}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>

      <label className="block mb-3">
        <div>Опис</div>
        <textarea
          name="description"
          placeholder="Двокімнатна квартира..."
          value={form.description}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full min-h-[60px]"
        />
      </label>
    </>
  );
};
