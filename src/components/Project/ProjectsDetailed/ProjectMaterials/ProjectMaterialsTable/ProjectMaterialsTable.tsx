"use client";
import React, { useState } from "react";
import styles from "./ProjectMaterialsTable.module.css";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { Material } from "@/types/material";

interface MaterialSelection {
  materialId: number;
  quantity: number;
}

interface Props {
  materials: Material[];
  selection: MaterialSelection[];
  editable?: boolean;
  confirmed?: boolean;
  onQuantityChange?: (materialId: number, quantity: number) => void;
  className?: string;
  enableTooltips?: boolean;
}

export const ProjectMaterialsTable = ({
  materials,
  selection,
  editable = false,
  confirmed = false,
  enableTooltips = true,
  onQuantityChange,
  className,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});

  const getQuantity = (materialId: number): number => {
    const selectionVal =
      selection.find((sel) => sel.materialId === materialId)?.quantity ?? 0;

    const raw = inputValues[materialId];
    return raw !== undefined ? Number(raw) || 0 : selectionVal;
  };

  const getInputValue = (materialId: number): string => {
    const selectionVal =
      selection.find((sel) => sel.materialId === materialId)?.quantity ?? 0;

    return inputValues[materialId] ?? selectionVal.toString();
  };

  const handleChange = (materialId: number, value: number) => {
    setInputValues((prev) => ({ ...prev, [materialId]: value.toString() }));
    if (onQuantityChange) onQuantityChange(materialId, value);
  };

  const handleInputChange = (materialId: number, val: string) => {
    setInputValues((prev) => ({ ...prev, [materialId]: val }));

    if (onQuantityChange) {
      if (val === "") {
        onQuantityChange(materialId, 0);
      } else {
        const num = Math.max(0, Number(val));
        if (!isNaN(num)) {
          onQuantityChange(materialId, num);
        }
      }
    }
  };

  return (
    <Table<Material>
      data={materials}
      className={className}
      showIndex
      expandedId={expandedId}
      enableTooltips={enableTooltips}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      columns={[
        { key: "name", label: "Найменування матеріалу" },
        {
          key: "quantity",
          label: "Кількість",
          render: (m) =>
            editable ? (
              <div
                className={`${styles.editContainer} h-full flex justify-center items-center gap-1`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
                  onClick={() =>
                    handleChange(m.id, Math.max(0, getQuantity(m.id) - 1))
                  }
                >
                  −
                </button>

                <input
                  type="number"
                  min={0}
                  value={getInputValue(m.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleInputChange(m.id, e.target.value)}
                  className={`${styles.editInput} md:w-12 w-[100px] text-center rounded px-1 py-0`}
                />

                <button
                  type="button"
                  className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
                  onClick={() => handleChange(m.id, getQuantity(m.id) + 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <span className={confirmed ? "text-green-600 " : ""}>
                {getQuantity(m.id)}
              </span>
            ),
        },
        { key: "unit", label: "Од. вимір." },

        { key: "base_purchase_price", label: "Закупка" },
        { key: "base_selling_price", label: "Продаж" },
        { key: "base_delivery", label: "Доставка" },
        {
          key: "sum",
          label: "Сума, грн",
          render: (m) => {
            const baseSelling = Number(m.base_selling_price) || 0;
            const baseDelivery = Number(m.base_delivery) || 0;
            const qty = getQuantity(m.id);
            return ((baseSelling + baseDelivery) * qty).toFixed(2);
          },
        },
      ]}
      renderInspection={(m) => (
        <Inspect<Material>
          item={m}
          getId={(item) => item.id}
          fields={[
            { label: "Од. вимір.", value: (item) => item.unit },
            {
              label: "Закупка, грн",
              value: (item) => item.base_purchase_price,
            },
            {
              label: "Продаж, грн",
              value: (item) => item.base_selling_price,
            },
            { label: "Доставка", value: (item) => item.base_delivery },
            {
              label: "Сума, грн",
              value: (item) =>
                (item.base_selling_price * getQuantity(m.id)).toFixed(2),
            },
          ]}
        />
      )}
    />
  );
};
