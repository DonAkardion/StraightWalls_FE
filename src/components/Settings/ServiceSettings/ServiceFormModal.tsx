"use client";
import React, { useState, useEffect } from "react";
import { Service } from "@/types/service";
import styles from "./ServiceFormModal.module.css";

interface Props {
  service: Service;
  onChange: (data: Service, isValid: boolean) => void;
  submitted?: boolean;
}

export const ServiceFormModal = ({
  service,
  onChange,
  submitted = false,
}: Props) => {
  const [form, setForm] = useState<Service>(service);

  const [errors, setErrors] = useState<{
    name?: string;
    unit_of_measurement?: string;
    price?: string;
    salary?: string;
  }>({});

  const validate = (data: Service) => {
    const newErrors: typeof errors = {};

    if (!data.name?.trim()) newErrors.name = "Назва є обов’язковою";
    if (!data.unit_of_measurement?.trim())
      newErrors.unit_of_measurement = "Одиниці вимірювання обов’язкові";

    if (data.price === undefined || Number(data.price) <= 0) {
      newErrors.price = "Ціна має бути більше 0";
    }

    if (data.salary === undefined || Number(data.salary) < 0) {
      newErrors.salary = "Зарплата не може бути меншою за 0";
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
    const { name, type, value } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "name" || name === "unit_of_measurement"
          ? value
          : value === ""
          ? ""
          : Number(value),
    }));
  };

  const inputClass = "border-b-1 p-2 pb-1 outline-none";

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      {/* Назва */}
      <div className={styles.ServiceModalInputTytle}>Назва послуги</div>
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

      {/* Одиниця вимірювання */}
      <div className={styles.ServiceModalInputTytle}>Одиниця вимірювання</div>
      <input
        type="text"
        name="unit_of_measurement"
        placeholder="Напр. м², год, шт"
        value={form.unit_of_measurement}
        onChange={handleChange}
        className={inputClass}
      />
      {submitted && errors.unit_of_measurement && (
        <p className="text-red-500 text-sm mt-1">
          {errors.unit_of_measurement}
        </p>
      )}

      {/* Ціна */}
      <div className={styles.ServiceModalInputTytle}>Ціна за одиницю</div>
      <input
        type="number"
        name="price"
        placeholder="Ціна"
        value={form.price ?? ""}
        onChange={handleChange}
        className={inputClass}
        min={0}
      />
      {submitted && errors.price && (
        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
      )}

      {/* Зарплата */}
      <div className={styles.ServiceModalInputTytle}>Зарплата працівника</div>
      <input
        type="number"
        name="salary"
        placeholder="Зарплата"
        value={form.salary ?? ""}
        onChange={handleChange}
        className={inputClass}
        min={0}
      />
      {submitted && errors.salary && (
        <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
      )}

      {/* Тип послуги */}
      <div className={styles.ServiceModalInputTytle}>Тип послуги</div>
      <select
        name="service_type"
        value={form.service_type}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none bg-transparent appearance-none"
      >
        <option value="main">Основна</option>
        <option value="additional">Додаткова</option>
      </select>

      {/* Чи активна */}
      <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />
        Активна
      </label>
    </div>
  );
};
