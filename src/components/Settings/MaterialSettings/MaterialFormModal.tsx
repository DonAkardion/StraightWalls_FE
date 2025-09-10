"use client";
import React, { useState, useEffect } from "react";
import { Material } from "@/types/material";
import styles from "./MaterialFormModal.module.css";

interface Props {
  material: Material;
  onChange: (data: Material) => void;
}

export const MaterialFormModal = ({ material, onChange }: Props) => {
  const [form, setForm] = useState<Material>(material);

  const [errors, setErrors] = useState<{
    name?: string;
    base_purchase_price?: string;
    base_selling_price?: string;
    unit?: string;
    stock?: string;
    base_delivery?: string;
  }>({});

  useEffect(() => {
    onChange(form);
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // простенька валідація
    if (name === "name" && !value.trim()) {
      setErrors((prev) => ({ ...prev, name: "Назва є обов’язковою" }));
    } else if (name === "name") {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }

    if (name === "unit" && !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        unit: "Одиниці вимірювання обов’язкові",
      }));
    } else if (name === "unit") {
      setErrors((prev) => ({ ...prev, unit: undefined }));
    }

    if (
      (name === "base_purchase_price" || name === "base_selling_price") &&
      (!value || Number(value) <= 0)
    ) {
      setErrors((prev) => ({ ...prev, [name]: "Вкажіть коректну ціну" }));
    } else if (
      name === "base_purchase_price" ||
      name === "base_selling_price"
    ) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
        className={`border-b-1 p-2 pb-1 outline-none ${
          errors.name ? "border-red-500" : "border-black"
        }`}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
      )}

      {/* Ціна Купівлі */}
      <div className={styles.ServiceModalInputTytle}>Ціна Купівлі</div>
      <input
        type="number"
        name="base_purchase_price"
        value={form.base_purchase_price ?? ""}
        onChange={handleChange}
        className={`border-b-1 p-2 pb-1 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          errors.base_purchase_price ? "border-red-500" : "border-black"
        }`}
        min={0}
      />
      {errors.base_purchase_price && (
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
        className={`border-b-1 p-2 pb-1 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          errors.base_selling_price ? "border-red-500" : "border-black"
        }`}
        min={0}
      />
      {errors.base_selling_price && (
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
        className={`border-b-1 p-2 pb-1 outline-none ${
          errors.unit ? "border-red-500" : "border-black"
        }`}
      />
      {errors.unit && (
        <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
      )}

      {/* Доставка */}
      <div className={styles.ServiceModalInputTytle}>Ціна Доставки</div>
      <input
        type="number"
        name="base_delivery"
        value={form.base_delivery ?? ""}
        onChange={handleChange}
        className={`border-b-1 p-2 pb-1 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          errors.base_delivery ? "border-red-500" : "border-black"
        }`}
        min={0}
      />
      {errors.base_delivery && (
        <p className="text-red-500 text-sm mt-1">{errors.base_delivery}</p>
      )}

      {/* Залишок */}
      <div className={styles.ServiceModalInputTytle}>Залишок</div>
      <input
        type="number"
        name="stock"
        value={form.stock ?? ""}
        onChange={handleChange}
        className={`border-b-1 p-2 pb-1 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          errors.stock ? "border-red-500" : "border-black"
        }`}
        min={0}
      />
      {errors.stock && (
        <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
      )}
    </div>
  );
};
