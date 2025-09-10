"use client";
import React, { useState } from "react";
import styles from "./ProjectMaterialsTable.module.css";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { Material, TableMaterial } from "@/types/material";
import { MaterialWithQuantity } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import { NumericInputWithControls } from "./NumericInputWithControls";

interface MaterialSelection {
  materialId: number;
  quantity: number;
  previous_remaining?: number;
  additional_delivery?: number;
  current_remaining?: number;
  delivery_quantity?: number;
}

interface Props {
  materials: TableMaterial[];
  selection: MaterialSelection[];
  editable?: boolean;
  confirmed?: boolean;
  onEdit?: (updated: TableMaterial) => void;
  // onDelete?: (id: number) => void;
  onQuantityChange?: (
    materialId: number,
    field: keyof MaterialWithQuantity,
    value: number
  ) => void;
  className?: string;
  enableTooltips?: boolean;
}

export const ProjectMaterialsTable = ({
  materials,
  selection,
  editable = false,
  confirmed = false,
  enableTooltips = true,
  onEdit,
  // onDelete,
  onQuantityChange,
  className,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const getSelectionQty = (materialId: number): number =>
    selection.find((s) => s.materialId === materialId)?.quantity ?? 0;

  const getValue = (
    materialId: number,
    field: keyof MaterialWithQuantity,
    fallback: number
  ): number => {
    const raw = inputValues[`${materialId}-${field}`];
    return raw !== undefined ? Number(raw) || 0 : fallback;
  };

  const getInputValue = (
    materialId: number,
    field: keyof MaterialWithQuantity,
    fallback: number
  ): string => {
    return inputValues[`${materialId}-${field}`] ?? fallback.toString();
  };

  const handleInputChange = (
    materialId: number,
    field: keyof MaterialWithQuantity,
    val: string
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [`${materialId}-${field}`]: val,
    }));

    if (onQuantityChange) {
      if (val === "") {
        onQuantityChange(materialId, field, 0);
      } else {
        const num = Math.max(0, Number(val));
        if (!isNaN(num)) {
          onQuantityChange(materialId, field, num);
        }
      }
    }
  };

  const num = (v: number | string | undefined) =>
    Number(v == null ? 0 : v) || 0;

  return (
    <Table<TableMaterial>
      data={materials}
      className={className}
      showIndex
      expandedId={expandedId}
      enableTooltips={enableTooltips}
      onEdit={onEdit ? (item) => onEdit(item) : undefined}
      // onDelete={(item) => onDelete(item.id)}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      columns={[
        { key: "name", label: "Найменування матеріалу" },

        { key: "base_purchase_price", label: "Закупка, грн" },
        { key: "base_selling_price", label: "Продаж, грн" },
        {
          key: "quantity",
          label: "Кількість",
          render: (m) =>
            editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="quantity"
                value={getInputValue(m.id, "quantity", 0)}
                fallback={0}
                onInputChange={handleInputChange}
                onStepChange={(id, field, val) =>
                  onQuantityChange?.(id, field, val)
                }
              />
            ) : (
              <span className={confirmed ? "text-green-600 " : ""}>
                {getValue(m.id, "quantity", getSelectionQty(m.id))}
              </span>
            ),
        },
        { key: "unit", label: "Од. вимір." },
        { key: "base_delivery", label: "Доставка" },
        {
          key: "previous_remaining",
          label: "Залишок",
          render: (m) =>
            editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="previous_remaining"
                value={getInputValue(m.id, "previous_remaining", 0)}
                fallback={Number(m.previous_remaining) ?? 0}
                onInputChange={handleInputChange}
                onStepChange={(id, field, val) =>
                  onQuantityChange?.(id, field, val)
                }
              />
            ) : (
              <span>{m.previous_remaining}</span>
            ),
        },
        {
          key: "additional_delivery",
          label: "Додатково",
          render: (m) =>
            editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="additional_delivery"
                value={getInputValue(m.id, "additional_delivery", 0)}
                fallback={0}
                onInputChange={handleInputChange}
                onStepChange={(id, field, val) =>
                  onQuantityChange?.(id, field, val)
                }
              />
            ) : (
              <span>{m.additional_delivery}</span>
            ),
        },
        {
          key: "current_remaining",
          label: "Наявно",
          render: (m) =>
            editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="current_remaining"
                value={getInputValue(m.id, "current_remaining", 0)}
                fallback={0}
                onInputChange={handleInputChange}
                onStepChange={(id, field, val) =>
                  onQuantityChange?.(id, field, val)
                }
              />
            ) : (
              <span>{m.current_remaining}</span>
            ),
        },
        {
          key: "delivery_quantity",
          label: "Доставлено",
          render: (m) => {
            const qty =
              Number(getValue(m.id, "quantity", getSelectionQty(m.id))) || 0;
            const prev =
              Number(
                getValue(
                  m.id,
                  "previous_remaining",
                  Number(m.previous_remaining) ?? 0
                )
              ) || 0;

            const delivered =
              typeof m.delivery_quantity === "number" && m.delivery_quantity > 0
                ? m.delivery_quantity
                : Math.max(0, qty - prev);

            return <span>{delivered}</span>;
          },
        },
        {
          key: "sum",
          label: "Сума, грн",
          render: (m) => {
            const baseSelling = num(m.base_selling_price);
            const baseDelivery = num(m.base_delivery);
            const qty = getValue(m.id, "quantity", getSelectionQty(m.id));
            return ((baseSelling + baseDelivery) * qty).toFixed(2);
          },
        },
      ]}
      renderInspection={(m) => (
        <Inspect<TableMaterial>
          item={m}
          getId={(item) => item.id}
          onEdit={onEdit}
          fields={[
            { label: "Од. вимір.", value: (item) => item.unit },
            {
              label: "Закупка, грн",
              value: (item) => num(item.base_purchase_price),
            },
            {
              label: "Продаж, грн",
              value: (item) => num(item.base_selling_price),
            },
            { label: "Доставка", value: (item) => num(item.base_delivery) },

            {
              label: "Доставлено",
              value: (item) => {
                const qty =
                  Number(
                    getValue(item.id, "quantity", getSelectionQty(item.id))
                  ) || 0;
                const prev =
                  Number(
                    getValue(
                      item.id,
                      "previous_remaining",
                      Number(item.previous_remaining) ?? 0
                    )
                  ) || 0;

                return item.delivery_quantity !== null
                  ? item.delivery_quantity
                  : Math.max(0, qty - prev);
              },
            },
            {
              label: "Сума, грн",
              value: (item) =>
                (
                  num(item.base_selling_price + item.baseDelivery) *
                    getValue(m.id, "quantity", getSelectionQty(m.id)) || 0
                ).toFixed(2),
            },
          ]}
        />
      )}
    />
  );
};
