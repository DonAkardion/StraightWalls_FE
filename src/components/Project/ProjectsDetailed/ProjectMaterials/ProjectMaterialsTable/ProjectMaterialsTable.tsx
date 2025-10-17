"use client";
import React, { useMemo, useState } from "react";
import styles from "./ProjectMaterialsTable.module.css";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { TableMaterial } from "@/types/material";
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
  onQuantityChange?: (
    materialId: number,
    field: keyof MaterialWithQuantity,
    value: number
  ) => void;
  className?: string;
  enableTooltips?: boolean;
}

const TOTAL_ROW_ID = -1;

export const ProjectMaterialsTable = ({
  materials,
  selection,
  editable = false,
  confirmed = false,
  enableTooltips = true,
  onEdit,
  onQuantityChange,
  className,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const safeNum = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const getSelectionQty = (materialId: number): number =>
    selection.find((s) => s.materialId === materialId)?.quantity ?? 0;

  const getValue = (
    materialId: number,
    field: keyof MaterialWithQuantity,
    fallback: number
  ): number => {
    const raw = inputValues[`${materialId}-${field}`];
    return raw !== undefined ? safeNum(raw) : fallback;
  };

  const getInputValue = (
    materialId: number,
    field: keyof MaterialWithQuantity,
    fallback: number
  ): string => inputValues[`${materialId}-${field}`] ?? fallback.toString();

  const handleInputChange = (
    materialId: number,
    field: keyof MaterialWithQuantity,
    val: string
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [`${materialId}-${field}`]: val,
    }));
    const num = val === "" ? 0 : Math.max(0, safeNum(val));
    onQuantityChange?.(materialId, field, num);
  };

  const totals = useMemo(() => {
    return materials.reduce(
      (acc, m) => {
        const qty = getValue(m.id, "quantity", getSelectionQty(m.id));
        const prev = getValue(
          m.id,
          "previous_remaining",
          Number(m.previous_remaining) ?? 0
        );
        const delivered =
          typeof m.delivery_quantity === "number" && m.delivery_quantity > 0
            ? m.delivery_quantity
            : Math.max(0, qty - prev);

        acc.quantity += qty;
        acc.delivered += delivered;
        acc.sum += safeNum(m.base_purchase_price) * qty;
        return acc;
      },
      { quantity: 0, delivered: 0, sum: 0 }
    );
  }, [materials, selection, inputValues]);

  const totalRow = useMemo(
    () =>
      ({
        id: TOTAL_ROW_ID,
        name: "Разом",
        base_purchase_price: "",
        unit: "",
        previous_remaining: 0,
        additional_delivery: 0,
        current_remaining: 0,
        delivery_quantity: totals.delivered,
        quantity: totals.quantity,
        sum: totals.sum,
      } as unknown as TableMaterial),
    [totals]
  );

  const dataWithTotal = useMemo(
    () => [...materials, totalRow],
    [materials, totalRow]
  );

  const isTotalRow = (m: TableMaterial) => m.id === TOTAL_ROW_ID;
  const format2 = (n: number) => safeNum(n).toFixed(2);

  return (
    <Table<TableMaterial>
      data={dataWithTotal}
      className={className}
      showIndex
      expandedId={expandedId}
      enableTooltips={enableTooltips}
      getRowClassName={(m) => (isTotalRow(m) ? styles.totalRow : "")}
      onEdit={onEdit ? (item) => !isTotalRow(item) && onEdit(item) : undefined}
      onInspect={(item) =>
        !isTotalRow(item) &&
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      columns={[
        {
          key: "name",
          label: "Найменування матеріалу",
          render: (m) => (isTotalRow(m) ? <strong>Разом</strong> : m.name),
        },
        { key: "base_purchase_price", label: "Ціна, грн" },
        {
          key: "quantity",
          label: "Кількість",
          render: (m) =>
            isTotalRow(m) ? (
              <strong>{totals.quantity}</strong>
            ) : editable ? (
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
              <span className={confirmed ? "text-green-600" : ""}>
                {getValue(m.id, "quantity", getSelectionQty(m.id))}
              </span>
            ),
        },
        {
          key: "unit",
          label: "Од. вимір.",
          render: (m) => (isTotalRow(m) ? "" : m.unit),
        },
        {
          key: "previous_remaining",
          label: "Залишок з поперед.",
          render: (m) =>
            isTotalRow(m) ? (
              ""
            ) : editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="previous_remaining"
                value={getInputValue(
                  m.id,
                  "previous_remaining",
                  Number(m.previous_remaining) ?? 0
                )}
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
          label: "Доставка",
          render: (m) =>
            isTotalRow(m) ? (
              ""
            ) : editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="additional_delivery"
                value={getInputValue(m.id, "additional_delivery", 0)}
                fallback={Number(m.additional_delivery) ?? 0}
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
          label: "Залишок",
          render: (m) =>
            isTotalRow(m) ? (
              ""
            ) : editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="current_remaining"
                value={getInputValue(m.id, "current_remaining", 0)}
                fallback={Number(m.current_remaining) ?? 0}
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
          render: (m) =>
            isTotalRow(m) ? (
              <strong>{totals.delivered}</strong>
            ) : (
              (() => {
                const qty = getValue(m.id, "quantity", getSelectionQty(m.id));
                const prev = getValue(
                  m.id,
                  "previous_remaining",
                  Number(m.previous_remaining) ?? 0
                );
                const delivered =
                  typeof m.delivery_quantity === "number" &&
                  m.delivery_quantity > 0
                    ? m.delivery_quantity
                    : Math.max(0, qty - prev);
                return <span>{delivered}</span>;
              })()
            ),
        },
        {
          key: "sum",
          label: "Сума, грн",
          render: (m) =>
            isTotalRow(m) ? (
              <strong>{format2(totals.sum)}</strong>
            ) : (
              format2(
                safeNum(m.base_purchase_price) *
                  getValue(m.id, "quantity", getSelectionQty(m.id))
              )
            ),
        },
      ]}
      renderInspection={(m) =>
        isTotalRow(m) ? null : (
          <Inspect<TableMaterial>
            item={m}
            getId={(item) => item.id}
            onEdit={onEdit}
            fields={[
              {
                label: "Ціна, грн",
                value: (item) => item.base_purchase_price,
              },
              {
                label: "Кількість",
                value: (item) =>
                  getValue(item.id, "quantity", getSelectionQty(item.id)),
              },
              { label: "Од. вимір.", value: (item) => item.unit },
              {
                label: "Залишок з поперед.",
                value: (item) => item.previous_remaining,
              },
              { label: "Доставка", value: (item) => item.additional_delivery },
              { label: "Залишок", value: (item) => item.current_remaining },
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
                  return typeof item.delivery_quantity === "number" &&
                    item.delivery_quantity > 0
                    ? item.delivery_quantity
                    : Math.max(0, qty - prev);
                },
              },
              {
                label: "Сума, грн",
                value: (item) =>
                  format2(
                    safeNum(item.base_purchase_price) *
                      getValue(item.id, "quantity", getSelectionQty(item.id))
                  ),
              },
            ]}
          />
        )
      }
    />
  );
};
