"use client";

import React, { useState } from "react";
import styles from "./MaterialIncomeTable.module.css";
import { Table } from "@/components/Table/Table";
import { MaterialIncome } from "@/types/materialIncome";
import { Inspect } from "@/components/Table/Inspect/Inspect";

interface Props {
  materials: MaterialIncome[];
  showHeader?: boolean;
  editable?: boolean;
  onAmountChange?: (id: number, newAmount: number) => void;
  className?: string;
  enableTooltips?: boolean;
}

export const MaterialIncomeTable = ({
  materials,
  showHeader = true,
  editable = false,
  onAmountChange,
  className,
  enableTooltips = true,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleDecrease = (e: React.MouseEvent, item: MaterialIncome) => {
    e.stopPropagation();
    const next = Math.max(0, item.amount - 1);
    if (onAmountChange) onAmountChange(item.id, next);
  };

  const handleIncrease = (e: React.MouseEvent, item: MaterialIncome) => {
    e.stopPropagation();
    const next = item.amount + 1;
    if (onAmountChange) onAmountChange(item.id, next);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: MaterialIncome
  ) => {
    e.stopPropagation();
    const value = e.target.value;
    if (value !== "" && Number(value) < 0) return;
    if (onAmountChange)
      onAmountChange(item.id, value === "" ? 0 : Number(value));
  };

  return (
    <div>
      <Table<MaterialIncome>
        data={materials}
        className={className}
        showIndex={true}
        showHeader={showHeader}
        expandedId={expandedId}
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        enableTooltips={enableTooltips}
        columns={[
          {
            key: "name",
            label: "Найменування послуги",
            tooltip: (i) => i.name,
          },
          { key: "price", label: "Сума", render: (i) => i.price },
          {
            key: "amount",
            label: "Кількість",
            render: (i) =>
              editable ? (
                <div
                  className={`${styles.editContainer} h-full flex justify-center items-center gap-1`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleDecrease(e, i)}
                    className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
                    type="button"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={i.amount === 0 ? "" : i.amount}
                    min={0}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange(e, i)}
                    className={`${styles.editInput} md:w-12 w-[90px] text-center rounded px-1 py-0`}
                    placeholder="0"
                  />
                  <button
                    onClick={(e) => handleIncrease(e, i)}
                    className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
                    type="button"
                  >
                    +
                  </button>
                </div>
              ) : (
                String(i.amount)
              ),
          },
          { key: "area", label: "Квадратура", render: (i) => i.area },
          { key: "income", label: "Заробіток", render: (i) => i.income },
        ]}
        renderInspection={(i) => (
          <Inspect<MaterialIncome>
            item={i}
            getId={(item) => item.id}
            fields={[
              { label: "Сума", value: (item) => item.price },
              { label: "Квадратура", value: (item) => item.area },
              { label: "Заробіток", value: (item) => item.income },
            ]}
          />
        )}
      />
    </div>
  );
};
