"use client";

import React from "react";
import styles from "./ProjectServicesTable.module.css";
import { Table } from "@/components/Table/Table";
import { Service } from "@/types/service";

interface ServiceSelection {
  serviceId: number;
  quantity: number;
}

interface Props {
  services: Service[];
  selection: ServiceSelection[];
  editable?: boolean;
  onQuantityChange?: (serviceId: number, quantity: number) => void;
  className?: string;
}

export const ProjectServicesTable = ({
  services,
  selection,
  editable = false,
  onQuantityChange,
  className,
}: Props) => {
  const getQuantity = (serviceId: number) =>
    selection.find((sel) => sel.serviceId === serviceId)?.quantity ?? 0;

  const handleChange = (serviceId: number, value: number) => {
    if (onQuantityChange) onQuantityChange(serviceId, value);
  };

  return (
    <Table<Service>
      data={services}
      className={className}
      showIndex
      columns={[
        { key: "name", label: "Найменування послуги" },
        { key: "unit_of_measurement", label: "Од. вимір." },
        {
          key: "quantity",
          label: "Кількість",
          render: (s) =>
            editable ? (
              <input
                type="number"
                min={0}
                value={getQuantity(s.id)}
                onChange={(e) => {
                  const val = e.target.value;
                  const quantity = val === "" ? 0 : Math.max(0, Number(val));
                  // викликаємо тільки під час дії користувача
                  onQuantityChange?.(s.id, quantity);
                }}
                onBlur={(e) => {
                  if (e.target.value === "") onQuantityChange?.(s.id, 0);
                }}
                className={`${styles.editInput} text-center`}
              />
            ) : (
              getQuantity(s.id)
            ),
        },
        { key: "price", label: "Вартість, грн" },
        {
          key: "sum",
          label: "Сума, грн",
          render: (s) => (s.price * getQuantity(s.id)).toFixed(2),
        },
      ]}
    />
  );
};
