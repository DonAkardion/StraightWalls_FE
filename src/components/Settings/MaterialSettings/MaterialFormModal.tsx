"use client";
import React, { useState, useEffect } from "react";
import { Service } from "@/types/service";
import styles from "./MaterialFormModal.module.css";

interface Props {
  service: Service;
  onChange: (data: Service) => void;
}

export const MaterialFormModal = ({ service, onChange }: Props) => {
  const [form, setForm] = useState<Service>(service);

  const [errors, setErrors] = useState<{
    name?: string;
    unit_of_measurement?: string;
    price?: string;
  }>({});

  useEffect(() => {
    onChange(form);
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;
    // const checked =
    //   type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    // const updatedValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      //   [name]: updatedValue,
    }));

    // простенька валідація
    if (name === "name" && !value.trim()) {
      setErrors((prev) => ({ ...prev, name: "Назва є обов’язковою" }));
    } else if (name === "name") {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }

    if (name === "unit_of_measurement" && !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        unit_of_measurement: "Одиниця вимірювання обов’язкова",
      }));
    } else if (name === "unit_of_measurement") {
      setErrors((prev) => ({ ...prev, unit_of_measurement: undefined }));
    }

    if (name === "price" && (!value || Number(value) <= 0)) {
      setErrors((prev) => ({ ...prev, price: "Вкажіть коректну ціну" }));
    } else if (name === "price") {
      setErrors((prev) => ({ ...prev, price: undefined }));
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
        name="price"
        value={form.price ?? ""}
        onChange={handleChange}
        className={`border-b-1 p-2 pb-1 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          errors.price ? "border-red-500" : "border-black"
        }`}
        min={0}
      />
      {errors.price && (
        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
      )}

      {/* Ціна Продажу */}
      <div className={styles.ServiceModalInputTytle}>Ціна Продажу</div>
      <input
        type="number"
        name="price"
        value={form.price ?? ""}
        onChange={handleChange}
        className={`border-b-1 p-2 pb-1 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          errors.price ? "border-red-500" : "border-black"
        }`}
        min={0}
      />
      {errors.price && (
        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
      )}

      {/* Одиниця вимірювання */}
      <div className={styles.ServiceModalInputTytle}>Одиниця вимірювання</div>
      <input
        type="text"
        name="unit_of_measurement"
        placeholder="Напр. м², год, шт"
        value={form.unit_of_measurement}
        onChange={handleChange}
        className={`border-b-1 p-2 pb-1 outline-none ${
          errors.unit_of_measurement ? "border-red-500" : "border-black"
        }`}
      />
      {errors.unit_of_measurement && (
        <p className="text-red-500 text-sm mt-1">
          {errors.unit_of_measurement}
        </p>
      )}

      {/* Тип послуги */}
      {/* <div className={styles.ServiceModalInputTytle}>Тип послуги</div>
      <select
        name="service_type"
        value={form.service_type}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none bg-transparent appearance-none"
      >
        <option value="main">Основна</option>
        <option value="additional">Додаткова</option>
      </select> */}

      {/* Опис */}
      {/* <div className={styles.ServiceModalInputTytle}>Опис</div>
      <textarea
        name="description"
        placeholder="Додатковий опис"
        value={form.description ?? ""}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none resize-none"
      /> */}

      {/* Чи активна */}
      {/* <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />
        Активна
      </label> */}
    </div>
  );
};
