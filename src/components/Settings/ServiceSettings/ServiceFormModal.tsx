"use client";
import React from "react";
import { Service } from "@/types/service";
import styles from "./ServiceFormModal.module.css";

interface Props {
  service: Service;
  onChange: (data: Service) => void;
}

export const ServiceFormModal = ({ service, onChange }: Props) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    onChange({
      ...service,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
          ? parseFloat(value)
          : value,
    });
  };

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      {/* Назва */}
      <div className={styles.ServiceModalInputTytle}>Назва послуги</div>
      <input
        type="text"
        name="name"
        placeholder="Назва"
        value={service.name}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />

      {/* Одиниця вимірювання */}
      <div className={styles.ServiceModalInputTytle}>Одиниця вимірювання</div>
      <input
        type="text"
        name="unit_of_measurement"
        placeholder="Напр. м², год, шт"
        value={service.unit_of_measurement}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />

      {/* Ціна */}
      <div className={styles.ServiceModalInputTytle}>Ціна за одиницю</div>
      <input
        type="number"
        name="price"
        placeholder="Ціна"
        value={service.price}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none "
        min={0}
      />

      {/* Тип послуги */}
      <div className={styles.ServiceModalInputTytle}>Тип послуги</div>
      <select
        name="service_type"
        value={service.service_type}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      >
        <option value="main">Основна</option>
        <option value="additional">Додаткова</option>
      </select>

      {/* Опис */}
      <div className={styles.ServiceModalInputTytle}>Опис</div>
      <textarea
        name="description"
        placeholder="Додатковий опис"
        value={service.description ?? ""}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none resize-none"
      />

      {/* Чи активна */}
      <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          name="is_active"
          checked={service.is_active}
          onChange={handleChange}
        />
        Активна
      </label>
    </div>
  );
};
