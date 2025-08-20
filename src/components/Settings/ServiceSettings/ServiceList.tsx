"use client";

import React, { useState, useEffect } from "react";
import { Service } from "@/types/service";
import { Table } from "@/components/Table/Table";
import { Pen, Trash } from "../../../../public/icons";
import styles from "./ServiceList.module.css";

interface Props {
  services: Service[];
  type: "main" | "additional";
  onDelete: (id: number) => void;
  onEdit: (updated: Service) => void;
  onAdd: () => void;
}

export const ServiceList = ({
  services,
  type,
  onDelete,
  onEdit,
  onAdd,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const filtered = services.filter((s) => s.service_type === type);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Table<Service>
      title={type === "main" ? "Основні послуги" : "Додаткові роботи"}
      showIndex={true}
      data={filtered}
      expandedId={expandedId}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={(item) => onDelete(item.id)}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      addButtonText="Додати послугу"
      columns={[
        {
          key: "name",
          label: isMobile ? "Назва" : "Найменування послуги",
        },
        { key: "unit_of_measurement", label: "Од. вимір." },
        {
          key: "price",
          label: "Вартість, грн",
          render: (s) => `${s.price.toFixed(2)} грн`,
        },
      ]}
      renderInspection={(s) => (
        <div className="pb-1 bg-white border-b relative">
          <div className="pl-[20px] pr-[10px] flex flex-col gap-2">
            <div className={`${styles.inspectRow} flex justify-between`}>
              <p>
                <span>Опис: </span>
                <span className="text-sm">{s.description || "немає"}</span>
              </p>
              <img
                src={Trash.src}
                alt="Delete"
                className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                onClick={() => onDelete(s.id)}
              />
            </div>
            <div className="flex justify-between">
              <p>
                <span>Ціна: </span>
                <span className="text-sm">{s.price.toFixed(2)} грн</span>
              </p>
              <img
                src={Pen.src}
                alt="Edit"
                className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                onClick={() => onEdit(s)}
              />
            </div>
            <div className="flex justify-between">
              <p>
                <span>Статус: </span>
                <span className="text-sm">
                  {s.is_active ? "Активна" : "Неактивна"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    />
  );
};
