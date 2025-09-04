"use client";

import React, { useState, useEffect } from "react";
import { Service } from "@/types/service";
import { Table } from "@/components/Table/Table";
import { Pen, Trash } from "../../../../public/icons";
import styles from "./MaterialList.module.css";

interface Props {
  services: Service[];
  type: "main" | "additional";
  onDelete: (id: number) => void;
  onEdit: (updated: Service) => void;
  onAdd: () => void;
  enableTooltips?: boolean;
}

export const MaterialsList = ({
  services,
  type,
  onDelete,
  onEdit,
  onAdd,
  enableTooltips = true,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const filtered = services.filter((service) => service.service_type === type);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Table<Service>
      title={"Список Матеріалів"}
      showIndex={true}
      data={filtered}
      expandedId={expandedId}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={(item) => onDelete(item.id)}
      enableTooltips={enableTooltips}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      addButtonText="Додати матеріал"
      columns={[
        {
          key: "name",
          label: "Назва",
        },
        {
          key: "purchase_price",
          label: "Купівля",
          render: (service) => `${service.price} грн`,
        },
        {
          key: "selling_price",
          label: "Продаж",
          render: (service) => `${service.price} грн`,
        },
        { key: "unit_of_measurement", label: "Од. вимір." },
        { key: "distributor", label: "Постачальник" },
        // {
        //   key: "is_active",
        //   label: "Статус",
        //   render: (service: Service) => {
        //     if (service.is_active) {
        //       return (
        //         <div className="flex justify-center items-center gap-2">
        //           <div className="h-4 w-4 rounded-full bg-green-600"></div>
        //           <span>Активна</span>
        //         </div>
        //       );
        //     }
        //     return (
        //       <div className="flex justify-center items-center gap-2">
        //         <div className="h-4 w-4 rounded-full bg-red-600"></div>
        //         <span>Неактивна</span>
        //       </div>
        //     );
        //   },
        // },
      ]}
      renderInspection={(s) => (
        <div className="pb-1 bg-white border-b relative">
          <div className="pl-[20px] pr-[10px] flex flex-col gap-2">
            <div className={`${styles.inspectRow} flex justify-between`}>
              <p>
                <span>Постачальник: </span>
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
                <span>Купівля: </span>
                <span className="text-sm">{s.price} грн</span>
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
                <span>Продаж: </span>
                <span className="text-sm">{s.price} грн</span>
              </p>
            </div>
          </div>
        </div>
      )}
    />
  );
};
