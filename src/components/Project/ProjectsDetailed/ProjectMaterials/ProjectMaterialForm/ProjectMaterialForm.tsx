"use client";
import React, { useEffect, useState } from "react";
import { TableMaterial } from "@/types/material";
import styles from "./MaterialFormModal.module.css";

interface Props {
  form: TableMaterial;
  setForm: React.Dispatch<React.SetStateAction<TableMaterial | null>>;
}

type EditableField =
  | "remaining_stock"
  | "previous_remaining"
  | "additional_delivery"
  | "current_remaining";

export const ProjectMaterialForm = ({ form, setForm }: Props) => {
  const [values, setValues] = useState<Record<EditableField, string>>({
    remaining_stock: String(form.remaining_stock ?? 0),
    previous_remaining: String(form.previous_remaining ?? 0),
    additional_delivery: String(form.additional_delivery ?? 0),
    current_remaining: String(form.current_remaining ?? 0),
  });

  const [errors, setErrors] = useState<Partial<Record<EditableField, string>>>(
    {}
  );

  useEffect(() => {
    setValues({
      remaining_stock: String(form.remaining_stock ?? 0),
      previous_remaining: String(form.previous_remaining ?? 0),
      additional_delivery: String(form.additional_delivery ?? 0),
      current_remaining: String(form.current_remaining ?? 0),
    });
    setErrors({});
  }, [form]);

  const parseDecimal = (raw: string): number => {
    const normalized = raw.replace(",", ".").trim();
    return normalized === "" ? NaN : Number(normalized);
  };

  const validateAndMaybeCommit = (name: EditableField, raw: string) => {
    if (raw === "") {
      setErrors((p) => ({ ...p, [name]: "Значення має бути числом ≥ 0" }));
      return;
    }
    const num = parseDecimal(raw);
    if (Number.isNaN(num) || num < 0) {
      setErrors((p) => ({ ...p, [name]: "Значення має бути числом ≥ 0" }));
      return;
    }

    setErrors((p) => ({ ...p, [name]: undefined }));
    setForm((prev) => (prev ? { ...prev, [name]: num } : prev));
  };

  const handleChange = (name: EditableField, raw: string) => {
    setValues((p) => ({ ...p, [name]: raw }));
    validateAndMaybeCommit(name, raw);
  };

  const renderNumberInput = (
    name: EditableField,
    label: string,
    placeholder?: string
  ) => (
    <>
      <label className={styles.ServiceModalInputTytle}>{label}</label>
      <input
        type="number"
        inputMode="decimal"
        step="any"
        min={0}
        placeholder={placeholder}
        value={values[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        className={`border-b-1 p-2 pb-1 outline-none ${
          errors[name] ? "border-red-500" : "border-black"
        }`}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </>
  );

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      {renderNumberInput("remaining_stock", "Залишок матеріалів")}
      {renderNumberInput("previous_remaining", "Залишилось з минулого об'єкту")}
      {renderNumberInput("additional_delivery", "Додаткова доставка")}
      {renderNumberInput("current_remaining", "Поточний залишок матеріалу")}
    </div>
  );
};
