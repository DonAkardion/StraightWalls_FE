"use client";
import React from "react";
import styles from "./ProjectMaterialsTable.module.css";
import { MaterialWithQuantity } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

interface Props {
  materialId: number;
  field: keyof MaterialWithQuantity;
  value: string;
  fallback: number;
  onInputChange: (
    materialId: number,
    field: keyof MaterialWithQuantity,
    val: string
  ) => void;
  onStepChange: (
    materialId: number,
    field: keyof MaterialWithQuantity,
    newValue: number
  ) => void;
  className?: string;
}

export const NumericInputWithControls = ({
  materialId,
  field,
  value,
  fallback,
  onInputChange,
  onStepChange,
  className,
}: Props) => {
  const displayValue = value === "" ? "" : value ?? fallback.toString();

  const stepChange = (delta: number) => {
    const newVal = Math.max(0, Number(displayValue) + delta);
    // спочатку оновлюємо локальне значення (string)
    onInputChange(materialId, field, newVal.toString());
    // потім синхронізуємо зовнішній стейт (number)
    onStepChange(materialId, field, newVal);
  };

  return (
    <div
      className={`${styles.editContainer} h-full flex justify-center items-center gap-1`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
        onClick={() => stepChange(-1)}
      >
        −
      </button>

      <input
        type="number"
        min={0}
        value={displayValue}
        onChange={(e) => onInputChange(materialId, field, e.target.value)}
        className={`${
          styles.editInput
        } md:w-12 w-[100px] text-center rounded px-1 py-0 ${className || ""}`}
      />

      <button
        type="button"
        className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
        onClick={() => stepChange(+1)}
      >
        +
      </button>
    </div>
  );
};
