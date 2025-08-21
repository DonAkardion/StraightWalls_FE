"use client";

import React, { useState } from "react";
import styles from "./ProjectServicesTable.module.css";
import { Table } from "@/components/Table/Table";
import { Service } from "@/types/service";
import { Inspect } from "@/components/Table/Inspect/Inspect";

interface Props {
  services: Service[];
  type: "main" | "additional";
  showHeader?: boolean;
  editable?: boolean;
  onAmountChange?: (id: string, newAmount: number) => void;
  className?: string;
  enableTooltips?: boolean;
}

export const ProjectServicesTable = ({
  type,
  services,
  showHeader = true,
  editable = false,
  // onAmountChange,
  className,
  enableTooltips = true,
}: Props) => {
  const filtered = services.filter((s) => s.service_type === type);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  // const handleDecrease = (e: React.MouseEvent, item: Service) => {
  //   e.stopPropagation();
  //   const next = Math.max(0, item.amount - 1);
  //   if (onAmountChange) {
  //     onAmountChange(item.id, next);
  //   }
  // };

  // const handleIncrease = (e: React.MouseEvent, item: Service) => {
  //   e.stopPropagation();
  //   const next = item.amount + 1;
  //   if (onAmountChange) {
  //     onAmountChange(item.id, next);
  //   }
  // };

  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   service: Service
  // ) => {
  //   e.stopPropagation();
  //   const value = e.target.value;

  //   // не дозволяємо від'ємні значення
  //   if (value !== "" && Number(value) < 0) return;

  //   // передаємо пустий інпут як 0 або як порожнє значення
  //   if (onAmountChange) {
  //     onAmountChange(service.id, value === "" ? 0 : Number(value));
  //   }
  // };

  return (
    <div className="">
      <Table<Service>
        data={filtered}
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
            tooltip: (і) => `Найменування послуги: ${і.name}`,
          },
          { key: "unit", label: "Од. вимір." },

          {
            key: "amount",
            label: "Кількість",
            render: (s) =>
              editable ? (
                <div
                  className={`${styles.editContainer} h-full flex justify-center items-center gap-1`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    // onClick={(e) => handleDecrease(e, s)}
                    className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center  justify-center bg-white cursor-pointer"
                    type="button"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    // value={s.amount === 0 ? "" : s.amount}
                    min={0}
                    onClick={(e) => e.stopPropagation()}
                    // onChange={(e) => handleInputChange(e, s)}
                    className={`${styles.editInput} md:w-12 w-[100px] text-center rounded px-1 py-0`}
                    placeholder="0"
                  />
                  <button
                    // onClick={(e) => handleIncrease(e, s)}
                    className="w-4 h-4 pb-[3px] rounded md:flex hidden items-center justify-center bg-white cursor-pointer"
                    type="button"
                  >
                    +
                  </button>
                </div>
              ) : (
                String(s.price)
              ),
          },
          {
            key: "price",
            label: "Вартість, грн",
            render: (s) => formatNumber(s.price),
          },
          // {
          //   key: "sum",
          //   label: "Сума",
          //   render: (s) => formatNumber(s.price * s.amount),
          // },
        ]}
        renderInspection={(s) => (
          <Inspect<Service>
            item={s}
            getId={(item) => item.id}
            fields={[
              {
                label: "Од. вимір.",
                value: (item) => item.unit_of_measurement,
              },
              {
                label: "Вартість, грн",
                value: (item) => item.price,
              },
              // {
              //   label: "Кількість",
              //   value: (item) => item.amount,
              // },
            ]}
          />
        )}
      />
    </div>
  );
};
