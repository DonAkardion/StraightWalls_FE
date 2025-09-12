"use client";

import React, { useState } from "react";
import styles from "./ProjectServicesTable.module.css";
import { Table } from "@/components/Table/Table";
import { Service } from "@/types/service";
import { WorkForTable } from "../ProjectEstimateComplete";
import { Inspect } from "@/components/Table/Inspect/Inspect";

interface ServiceSelection {
  serviceId: number;
  quantity: number;
}

interface Props {
  services: Service[];
  selection: ServiceSelection[];
  editable?: boolean;
  confirmed?: boolean;
  onQuantityChange?: (serviceId: number, quantity: number) => void;
  onEdit?: (updated: WorkForTable) => void;
  className?: string;
  enableTooltips?: boolean;
}

export const ProjectServicesTable = ({
  services,
  selection,
  editable = false,
  confirmed = false,
  enableTooltips = true,
  onQuantityChange,
  onEdit,
  className,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});

  const getQuantity = (serviceId: number): number => {
    const selectionVal =
      selection.find((sel) => sel.serviceId === serviceId)?.quantity ?? 0;

    const raw = inputValues[serviceId];
    return raw !== undefined ? Number(raw) || 0 : selectionVal;
  };

  const getInputValue = (serviceId: number): string => {
    const selectionVal =
      selection.find((sel) => sel.serviceId === serviceId)?.quantity ?? 0;

    return inputValues[serviceId] ?? selectionVal.toString();
  };

  const handleChange = (serviceId: number, value: number) => {
    setInputValues((prev) => ({ ...prev, [serviceId]: value.toString() }));
    if (onQuantityChange) onQuantityChange(serviceId, value);
  };

  const handleInputChange = (serviceId: number, val: string) => {
    setInputValues((prev) => ({ ...prev, [serviceId]: val }));

    if (onQuantityChange) {
      if (val === "") {
        onQuantityChange(serviceId, 0);
      } else {
        const num = Math.max(0, Number(val));
        if (!isNaN(num)) {
          onQuantityChange(serviceId, num);
        }
      }
    }
  };

  return (
    <Table<Service>
      data={services}
      className={className}
      showIndex
      expandedId={expandedId}
      enableTooltips={enableTooltips}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      onEdit={onEdit ? (item) => onEdit(item) : undefined}
      columns={[
        {
          key: "name",
          label: "Найменування послуги",
          tooltip: (service) => `Назва: ${service.name}`,
        },

        {
          key: "quantity",
          label: "Кількість",
          render: (s) =>
            editable ? (
              <div
                className={`${styles.editContainer} h-full flex justify-center items-center gap-1`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
                  onClick={() =>
                    handleChange(s.id, Math.max(0, getQuantity(s.id) - 1))
                  }
                >
                  −
                </button>

                <input
                  type="number"
                  min={0}
                  value={getInputValue(s.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleInputChange(s.id, e.target.value)}
                  className={`${styles.editInput} md:w-12 w-[100px] text-center rounded px-1 py-0`}
                />

                <button
                  type="button"
                  className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
                  onClick={() => handleChange(s.id, getQuantity(s.id) + 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <span className={confirmed ? "text-green-600 " : ""}>
                {getQuantity(s.id)}
              </span>
            ),
        },
        { key: "unit_of_measurement", label: "Од. вимір." },
        { key: "price", label: "Вартість, грн" },
        {
          key: "salary",
          label: "Зарплата",
          tooltip: (service) =>
            `Опис: ${(service.salary ?? service.salary, "0")}`,
        },
        {
          key: "sum",
          label: "Сума, грн",
          render: (s) => (s.price * getQuantity(s.id)).toFixed(2),
        },
      ]}
      renderInspection={(s) => (
        <Inspect<Service>
          item={s}
          getId={(item) => item.id}
          onEdit={onEdit}
          fields={[
            // {
            //   label: "Кількість",
            //   value: (s) => s.quantity,
            // },
            {
              label: "Од. вимір.",
              value: (item) => item.unit_of_measurement,
            },
            {
              label: "Вартість, грн",
              value: (item) => item.price,
            },
            {
              label: "Сума, грн",
              value: (item) => (item.price * getQuantity(s.id)).toFixed(2),
            },
          ]}
        />
      )}
    />
  );
};
