"use client";

import React, { useState, useEffect } from "react";
import { Service, ServiceType } from "@/types/service";
import { Table } from "@/components/Table/Table";
import { Pen, Trash } from "../../../../public/icons";
import styles from "./ServiceList.module.css";

interface Props {
  services: Service[];
  type: ServiceType;
  onDelete: (id: string) => void;
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const filtered = services.filter((s) => s.serviceType === type);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // breakpoint
    };

    handleResize(); // одразу перевіряємо

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Table<Service>
      title={
        type === "Основні послуги" ? "Основні послуги" : "Додаткові роботи"
      }
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
        { key: "name", label: isMobile ? "Назва" : "Найменування послуги" },
        { key: "unit", label: "Од. вимір." },
        {
          key: "price",
          label: "Вартість, грн",
          render: (s) => `${s.price.toFixed(2)} `,
        },
        {
          key: "sum",
          label: "Сума",
          render: (s) => (s.price * s.amount).toFixed(2),
        },
      ]}
      renderInspection={(s) => (
        <div className=" pb-1  bg-white border-b-1 relative">
          <div className="pl-[20px] pr-[10px] flex flex-col gap-2 ">
            <div className={`${styles.inspectRow} flex justify-between`}>
              <p>
                <span>Од. виміру: </span>
                <span className="text-sm ">{s.unit}</span>
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
                <span className="text-sm ">{s.price.toFixed(2)} грн</span>
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
                <span>Кількість: </span>
                <span className="text-sm ">{s.amount}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    />
  );
};
