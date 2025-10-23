"use client";

import React, { useMemo, useState } from "react";
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
  onPriceChange?: (serviceId: number, newPrice: number) => void;
  onEdit?: (updated: WorkForTable) => void;
  className?: string;
  enableTooltips?: boolean;
}

const TOTAL_ROW_ID = -1;

export const ProjectServicesTable = ({
  services,
  selection,
  editable = false,
  confirmed = false,
  enableTooltips = true,
  onQuantityChange,
  onPriceChange,
  onEdit,
  className,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});

  const safeNum = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const getQuantity = (serviceId: number): number => {
    const selQ =
      selection.find((s) => s.serviceId === serviceId)?.quantity ?? 0;
    const raw = inputValues[serviceId];
    return raw !== undefined ? safeNum(raw) : safeNum(selQ);
  };

  const getInputValue = (serviceId: number): string => {
    const selQ =
      selection.find((s) => s.serviceId === serviceId)?.quantity ?? 0;
    return inputValues[serviceId] ?? String(selQ);
  };

  const handleChange = (serviceId: number, value: number) => {
    setInputValues((prev) => ({
      ...prev,
      [serviceId]: String(Math.max(0, value)),
    }));
    onQuantityChange?.(serviceId, Math.max(0, value));
  };

  const handleInputChange = (serviceId: number, val: string) => {
    setInputValues((prev) => ({ ...prev, [serviceId]: val }));
    if (val === "") {
      onQuantityChange?.(serviceId, 0);
      return;
    }
    const num = safeNum(val);
    if (num >= 0) onQuantityChange?.(serviceId, num);
  };

  const getPrice = (serviceId: number, original: number): number => {
    const raw = priceInputs[serviceId];
    return raw !== undefined ? safeNum(raw) : safeNum(original);
  };

  const getPriceInput = (serviceId: number, original: number): string =>
    priceInputs[serviceId] ?? String(original);

  const handlePriceChange = (serviceId: number, val: string) => {
    setPriceInputs((prev) => ({ ...prev, [serviceId]: val }));
    const num = val === "" ? 0 : safeNum(val);
    onPriceChange?.(serviceId, Math.max(0, num));
  };

  const totals = useMemo(() => {
    return services.reduce(
      (acc, s) => {
        const q = getQuantity(s.id);
        const price = getPrice(s.id, s.price);
        const salary = safeNum((s as any).salary);
        acc.quantity += q;
        acc.price += price;
        acc.salary += salary;
        acc.sum += price * q;
        return acc;
      },
      { quantity: 0, price: 0, salary: 0, sum: 0 }
    );
  }, [services, selection, inputValues, priceInputs]);

  const totalRowPlaceholder = useMemo(
    () =>
      ({
        id: TOTAL_ROW_ID,
        name: "Разом",
        unit_of_measurement: "",
        price: 0,
        salary: 0,
      } as unknown as Service),
    []
  );

  const extendedData = useMemo(
    () => [...services, totalRowPlaceholder],
    [services, totalRowPlaceholder]
  );

  const format2 = (n: number) => safeNum(n).toFixed(2);

  const isTotalRow = (item: Service) => item.id === TOTAL_ROW_ID;

  return (
    <Table<Service>
      data={extendedData}
      className={className}
      showIndex
      expandedId={expandedId}
      enableTooltips={enableTooltips}
      onInspect={(item) => {
        if (isTotalRow(item)) return;
        setExpandedId((prev) => (prev === item.id ? null : item.id));
      }}
      onEdit={
        onEdit ? (item) => !isTotalRow(item) && onEdit(item as any) : undefined
      }
      getRowClassName={(item) => (isTotalRow(item) ? styles.totalRow : "")}
      columns={[
        {
          key: "name",
          label: "Найменування послуги",
          render: (s) => (isTotalRow(s) ? <strong>Разом</strong> : s.name),
          tooltip: (s) => `Назва: ${s.name}`,
        },
        {
          key: "quantity",
          label: "Кількість",
          render: (s) =>
            isTotalRow(s) ? (
              <strong>{totals.quantity}</strong>
            ) : editable ? (
              <div
                className={`${styles.editContainer} h-full flex justify-center items-center gap-1`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
                  onClick={() => handleChange(s.id, getQuantity(s.id) - 1)}
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
        {
          key: "unit_of_measurement",
          label: "Од. вимір.",
          render: (s) => s.unit_of_measurement,
        },
        {
          key: "price",
          label: "Вартість, грн",
          render: (s) =>
            isTotalRow(s) ? (
              <strong></strong>
            ) : editable ? (
              <input
                type="number"
                min={0}
                value={getPriceInput(s.id, s.price)}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handlePriceChange(s.id, e.target.value)}
                className={`${styles.editInput} md:w-16 w-[100px] text-center rounded px-1 py-0`}
              />
            ) : (
              <span className={confirmed ? "text-green-600 " : ""}>
                {format2(getPrice(s.id, s.price))}
              </span>
            ),
        },
        {
          key: "salary",
          label: "Зарплата",
          render: (s) =>
            isTotalRow(s) ? (
              <strong></strong>
            ) : (
              format2(safeNum((s as any).salary))
            ),
        },
        {
          key: "sum",
          label: "Сума, грн",
          render: (s) =>
            isTotalRow(s) ? (
              <strong>{format2(totals.sum)}</strong>
            ) : (
              format2(getPrice(s.id, s.price) * getQuantity(s.id))
            ),
        },
      ]}
      renderInspection={(s) =>
        isTotalRow(s) ? null : (
          <Inspect<Service>
            item={s}
            getId={(item) => item.id}
            onEdit={onEdit}
            fields={[
              {
                label: "Од. вимір.",
                value: (item) => item.unit_of_measurement,
              },
              // {
              //   label: "Вартість, грн",
              //   value: (item) => format2(safeNum(item.price)),
              // },
              {
                label: "Сума, грн",
                value: () => format2(safeNum(s.price) * getQuantity(s.id)),
              },
            ]}
          />
        )
      }
    />
  );
};
