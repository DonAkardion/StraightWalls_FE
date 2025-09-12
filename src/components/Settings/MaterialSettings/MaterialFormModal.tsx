"use client";
import React, { useState, useEffect } from "react";
import { Material } from "@/types/material";
import styles from "./MaterialFormModal.module.css";

interface Props {
  material: Material;
  onChange: (data: Material, isValid: boolean) => void;
  submitted?: boolean;
}

export const MaterialFormModal = ({
  material,
  onChange,
  submitted = false,
}: Props) => {
  const [form, setForm] = useState<Material>(material);

  const [errors, setErrors] = useState<{
    name?: string;
    base_purchase_price?: string;
    base_selling_price?: string;
    unit?: string;
    stock?: string;
    base_delivery?: string;
  }>({});

  const validate = (data: Material) => {
    const newErrors: typeof errors = {};

    if (!data.name?.trim()) newErrors.name = "Назва є обов’язковою";
    if (!data.unit?.trim()) newErrors.unit = "Одиниці вимірювання обов’язкові";

    if (
      data.base_purchase_price === undefined ||
      Number(data.base_purchase_price) <= 0
    ) {
      newErrors.base_purchase_price = "Вкажіть коректну ціну";
    }
    if (
      data.base_selling_price === undefined ||
      Number(data.base_selling_price) <= 0
    ) {
      newErrors.base_selling_price = "Вкажіть коректну ціну";
    }

    if (data.stock === undefined || Number(data.stock) <= 0) {
      newErrors.stock = "Залишок має бути більше 0";
    }

    if (data.base_delivery === undefined || Number(data.base_delivery) < 0) {
      newErrors.base_delivery = "Ціна доставки не може бути від’ємною";
    }

    return newErrors;
  };

  useEffect(() => {
    const newErrors = validate(form);
    setErrors(newErrors);
    onChange(form, Object.keys(newErrors).length === 0);
  }, [form]);

  useEffect(() => {
    if (submitted) {
      const newErrors = validate(form);
      setErrors(newErrors);
    }
  }, [submitted]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "name" || name === "unit"
          ? value
          : value === "" // 👈 дозволяємо порожнє
          ? ""
          : Number(value),
    }));
  };

  const inputClass = "border-b-1 p-2 pb-1 outline-none";

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      {/* Назва */}
      <div className={styles.ServiceModalInputTytle}>Назва матеріалу</div>
      <input
        type="text"
        name="name"
        placeholder="Назва"
        value={form.name}
        onChange={handleChange}
        className={inputClass}
      />
      {submitted && errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
      )}

      {/* Ціна Купівлі */}
      <div className={styles.ServiceModalInputTytle}>Ціна Купівлі</div>
      <input
        type="number"
        name="base_purchase_price"
        value={form.base_purchase_price ?? ""}
        onChange={handleChange}
        className={inputClass}
        min={0}
      />
      {submitted && errors.base_purchase_price && (
        <p className="text-red-500 text-sm mt-1">
          {errors.base_purchase_price}
        </p>
      )}

      {/* Ціна Продажу */}
      <div className={styles.ServiceModalInputTytle}>Ціна Продажу</div>
      <input
        type="number"
        name="base_selling_price"
        value={form.base_selling_price ?? ""}
        onChange={handleChange}
        className={inputClass}
        min={0}
      />
      {submitted && errors.base_selling_price && (
        <p className="text-red-500 text-sm mt-1">{errors.base_selling_price}</p>
      )}

      {/* Одиниця вимірювання */}
      <div className={styles.ServiceModalInputTytle}>Одиниця вимірювання</div>
      <input
        type="text"
        name="unit"
        placeholder="Напр. м², год, шт"
        value={form.unit}
        onChange={handleChange}
        className={inputClass}
      />
      {submitted && errors.unit && (
        <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
      )}

      {/* Доставка */}
      <div className={styles.ServiceModalInputTytle}>Ціна Доставки</div>
      <input
        type="number"
        name="base_delivery"
        value={form.base_delivery ?? ""}
        onChange={handleChange}
        className={inputClass}
        min={0}
      />
      {submitted && errors.base_delivery && (
        <p className="text-red-500 text-sm mt-1">{errors.base_delivery}</p>
      )}

      {/* Залишок */}
      <div className={styles.ServiceModalInputTytle}>Залишок</div>
      <input
        type="number"
        name="stock"
        value={form.stock ?? ""}
        onChange={handleChange}
        className={inputClass}
        min={0}
      />
      {submitted && errors.stock && (
        <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
      )}
    </div>
  );
};
