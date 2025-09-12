"use client";

import React, { useEffect, useState } from "react";
import { ClientObject } from "@/types/client";

interface Props {
  object?: ClientObject;
  onChange: (
    data: Pick<ClientObject, "name" | "address" | "description">,
    isValid: boolean
  ) => void;
}

export const ClientObjectFormModal = ({ object, onChange }: Props) => {
  const [form, setForm] = useState<
    Pick<ClientObject, "name" | "address" | "description">
  >({
    name: object?.name ?? "",
    address: object?.address ?? "",
    description: object?.description ?? "",
  });

  const [touched, setTouched] = useState<{ name?: boolean; address?: boolean }>(
    {}
  );

  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});

  useEffect(() => {
    if (object) {
      setForm({
        name: object.name ?? "",
        address: object.address ?? "",
        description: object.description ?? "",
      });
      setTouched({});
    } else {
      setForm({ name: "", address: "", description: "" });
      setTouched({});
    }
  }, [object]);

  // валідація при зміні форми
  useEffect(() => {
    const newErrors: { name?: string; address?: string } = {};
    if (!form.name.trim()) newErrors.name = "Поле назви обов'язкове";
    if (!form.address.trim()) newErrors.address = "Поле адреси обов'язкове";

    setErrors(newErrors);
    onChange(form, Object.keys(newErrors).length === 0);
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

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
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
          onBlur={handleBlur}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
        {touched.name && errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </label>

      <label className="block mb-3">
        <div>Адреса</div>
        <input
          type="text"
          name="address"
          placeholder="вул. Шевченка, 10"
          value={form.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
        {touched.address && errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </label>

      <label className="block mb-3">
        <div>Опис</div>
        <textarea
          name="description"
          placeholder="Двокімнатна квартира..."
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className="border-b-1 p-2 pb-1 outline-none w-full min-h-[60px]"
        />
      </label>
    </>
  );
};
