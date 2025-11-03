"use client";
import React, { useState, useMemo } from "react";
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
  // area?: number;
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
  // area,
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

  const getSelectionQty = (material: TableMaterial): number =>
    selection.find((s) => s.materialId === material.material_id)?.quantity ?? 0;

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

  // === TOTAlS ===
  const totals = useMemo(() => {
    return materials.reduce(
      (acc, m) => {
        const qty = getValue(m.id, "quantity", getSelectionQty(m));
        const prev = getValue(
          m.id,
          "previous_remaining",
          Number(m.previous_remaining) ?? 0
        );
        const delivery = getValue(
          m.id,
          "additional_delivery",
          Number(m.additional_delivery) ?? 0
        );
        const current = getValue(
          m.id,
          "current_remaining",
          Number(m.current_remaining) ?? 0
        );
        const price = getValue(
          m.id,
          "base_purchase_price",
          Number(m.base_purchase_price) ?? 0
        );
        acc.quantity += qty;
        acc.previous_remaining += prev;
        acc.additional_delivery += delivery;
        acc.current_remaining += current;
        acc.sum += price * qty;
        return acc;
      },
      {
        quantity: 0,
        previous_remaining: 0,
        additional_delivery: 0,
        current_remaining: 0,
        sum: 0,
      }
    );
  }, [materials, inputValues, selection]);

  const totalRowPlaceholder = useMemo(
    () =>
      ({
        id: TOTAL_ROW_ID,
        name: "Разом",
        unit: "",
        base_purchase_price: 0,
        quantity: 0,
      } as unknown as TableMaterial),
    []
  );

  const extendedData = useMemo(
    () => [...materials, totalRowPlaceholder],
    [materials, totalRowPlaceholder]
  );
  const isTotalRow = (m: TableMaterial) => m.id === TOTAL_ROW_ID;

  const format2 = (n: number) => safeNum(n).toFixed(2);

  return (
    <Table<TableMaterial>
      data={extendedData}
      className={className}
      showIndex
      expandedId={expandedId}
      enableTooltips={enableTooltips}
      onEdit={onEdit ? (item) => !isTotalRow(item) && onEdit(item) : undefined}
      onInspect={(item) => {
        if (isTotalRow(item)) return;
        setExpandedId((prev) => (prev === item.id ? null : item.id));
      }}
      getRowClassName={(item) => (isTotalRow(item) ? styles.totalRow : "")}
      columns={[
        {
          key: "name",
          label: "Найменування матеріалу",
          tooltip: (material) => `Назва: ${material.name}`,
          render: (m) => (isTotalRow(m) ? <strong>Разом</strong> : m.name),
        },
        {
          key: "base_purchase_price",
          label: "Ціна, грн",
          render: (m) =>
            isTotalRow(m) ? (
              ""
            ) : editable ? (
              <input
                type="number"
                min={0}
                value={getInputValue(
                  m.id,
                  "base_purchase_price",
                  Number(m.base_purchase_price) ?? 0
                )}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange(m.id, "base_purchase_price", val);
                }}
                onClick={(e) => e.stopPropagation()}
                className={`${styles.editInput} md:w-16 w-[100px] text-center rounded px-1 py-0`}
              />
            ) : (
              <span className={confirmed ? "text-green-600" : ""}>
                {getValue(
                  m.id,
                  "base_purchase_price",
                  Number(m.base_purchase_price) ?? 0
                )}
              </span>
            ),
        },
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
                value={getInputValue(m.id, "quantity", m.quantity ?? 0)}
                fallback={0}
                onInputChange={handleInputChange}
                onStepChange={(id, field, val) =>
                  onQuantityChange?.(id, field, val)
                }
              />
            ) : (
              <span className={confirmed ? "text-green-600 " : ""}>
                {getValue(m.id, "quantity", getSelectionQty(m))}
              </span>
            ),
        },
        // {
        //   key: "quantity",
        //   label: "Кількість",
        //   render: (m) => (
        //     <span>
        //       {area ?? getValue(m.id, "quantity", getSelectionQty(m.id))}
        //     </span>
        //   ),
        // },
        {
          key: "unit",
          label: "Од. вимір.",
          tooltip: (material) => `Од. вимір.: ${material.unit}`,
          render: (m) => (isTotalRow(m) ? "" : m.unit),
        },
        {
          key: "previous_remaining",
          label: "Залишок з поперед.",
          render: (m) =>
            isTotalRow(m) ? (
              <strong>{totals.previous_remaining}</strong>
            ) : editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="previous_remaining"
                value={getInputValue(
                  m.id,
                  "previous_remaining",
                  Number(m.previous_remaining ?? 0)
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
              <strong>{totals.additional_delivery}</strong>
            ) : editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="additional_delivery"
                value={getInputValue(
                  m.id,
                  "additional_delivery",
                  Number(m.additional_delivery ?? 0)
                )}
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
              <strong>{totals.current_remaining}</strong>
            ) : editable ? (
              <NumericInputWithControls
                materialId={m.id}
                field="current_remaining"
                value={getInputValue(
                  m.id,
                  "current_remaining",
                  Number(m.current_remaining ?? 0)
                )}
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
          render: (m) => {
            if (isTotalRow(m)) return "";
            const qty =
              Number(getValue(m.id, "quantity", getSelectionQty(m))) || 0;
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
          render: (m) =>
            isTotalRow(m) ? (
              <strong>{format2(totals.sum)}</strong>
            ) : (
              (() => {
                const qty = getValue(m.id, "quantity", getSelectionQty(m));
                return (Number(m.base_purchase_price) * qty).toFixed(2);
              })()
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
              { label: "Од. вимір.", value: (item) => item.unit },
              {
                label: "Доставлено",
                value: (item) => {
                  const qty =
                    Number(
                      getValue(item.id, "quantity", getSelectionQty(item))
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
                value: (item) => {
                  const qty = getValue(
                    item.id,
                    "quantity",
                    getSelectionQty(item)
                    // const qty =
                    //   area ??
                    //   getValue(item.id, "quantity", getSelectionQty(item.id));
                    // const price = getValue(
                    //   m.id,
                    //   "base_purchase_price",
                    //   Number(m.base_purchase_price) ?? 0
                  );
                  return (num(item.base_purchase_price) * qty).toFixed(2);
                },
              },
            ]}
          />
        )
      }
    />
  );
};
