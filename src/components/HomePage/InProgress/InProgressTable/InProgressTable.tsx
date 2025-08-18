"use client";
import styles from "./InProgressTable.module.css";
import React, { useState } from "react";
import { Table } from "@/components/Table/Table";
import { InProgress } from "@/types/inProgress";
import { mockCrews } from "@/mock/Crew/crewMock";

interface InProgressTableProps {
  data: InProgress[];
  className?: string;
}

export const InProgressTable: React.FC<InProgressTableProps> = ({
  data,
  className,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const orders = [
    {
      label: "Минуле замовлення",
      status: "Готово",
      action: "Здати",
    },
    {
      label: "Поточне замовлення",
      status: "Готово",
      action: "Здати",
    },
    {
      label: "Майбутнє замовлення",
      status: "Очікує",
      action: "Здати",
    },
  ];

  const columns = [
    {
      key: "projectCrew",
      label: "Бригада",
      render: (row: InProgress) => (
        <div className="flex flex-col gap-[10px]">
          <div>
            {mockCrews.find((crew) => crew.id === row.projectCrew)?.name || ""}
          </div>
          {orders.map((order, idx) => (
            <div
              key={idx}
              className={`${
                idx === 0
                  ? styles.pastOrder
                  : idx === 1
                  ? styles.currentOrder
                  : styles.futureOrder
              } ${styles.hideOnMobile}`}
            >
              {order.label}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "currentStage",
      label: "Етап",
      render: () => (
        <div className="flex flex-col gap-[10px]">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className={
                idx === 0
                  ? styles.pastOrder
                  : idx === 1
                  ? styles.currentOrder
                  : styles.futureOrder
              }
            >
              {order.status}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "nextStage",
      label: "Наступний етап",
      render: () => (
        <div className="flex flex-col gap-[10px]">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className={
                idx === 0
                  ? styles.pastOrder
                  : idx === 1
                  ? styles.currentOrder
                  : styles.futureOrder
              }
            >
              Здати
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "materialsIncome",
      label: "Зар. матеріали",
      render: (row: InProgress) => (
        <div className="flex flex-col gap-[10px]">
          {orders.map((_, idx) => (
            <div
              key={idx}
              className={
                idx === 0
                  ? styles.pastOrder
                  : idx === 1
                  ? styles.currentOrder
                  : styles.futureOrder
              }
            >
              {row.materialsIncome}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "crewSalary",
      label: "Зарплати",
      render: (row: InProgress) => (
        <div className="flex flex-col gap-[10px]">
          {orders.map((_, idx) => (
            <div
              key={idx}
              className={
                idx === 0
                  ? styles.pastOrder
                  : idx === 1
                  ? styles.currentOrder
                  : styles.futureOrder
              }
            >
              {row.crewSalary}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      showIndex={true}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      expandedId={expandedId}
      className={className}
      renderInspection={() => (
        <div className="p-2 pl-3 md:hidden flex flex-col gap-1">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className={`${
                idx === 0
                  ? styles.pastOrder
                  : idx === 1
                  ? styles.currentOrder
                  : styles.futureOrder
              } ${styles.inspectText}`}
            >
              <div className="flex justify-between gap-2 text-nowrap">
                <span className="w-1/2 truncate">{order.label}</span>
                <span className="w-1/4 truncate">{order.status}</span>
                <span className="w-1/4 truncate">{order.action}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
};
