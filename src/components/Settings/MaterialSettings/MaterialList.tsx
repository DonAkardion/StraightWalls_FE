"use client";

import React, { useState, useEffect } from "react";
import { Material } from "@/types/material";
import { Table } from "@/components/Table/Table";
import { Pen, Trash } from "../../../../public/icons";
import styles from "./MaterialList.module.css";

interface Props {
  materials: Material[];
  onDelete: (id: number) => void;
  onEdit: (updated: Material) => void;
  onAdd: () => void;
  enableTooltips?: boolean;
}

export const MaterialsList = ({
  materials,
  onDelete,
  onEdit,
  onAdd,
  enableTooltips = true,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Table<Material>
      title={"Список Матеріалів"}
      showIndex={true}
      data={materials}
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
          key: "base_purchase_price",
          label: "Купівля",
          render: (material) => `${material.base_purchase_price} грн`,
        },
        {
          key: "base_selling_price",
          label: "Продаж",
          render: (material) => `${material.base_selling_price} грн`,
        },
        { key: "unit", label: "Од. вимір." },
        { key: "stock", label: "Залишок" },
        { key: "base_delivery", label: "Доставка" },
      ]}
      renderInspection={(m) => (
        <div className="pb-1 bg-white border-b relative">
          <div className="pl-[20px] pr-[10px] flex flex-col gap-2">
            <div className={`${styles.inspectRow} flex justify-between`}>
              {/* <p>
                <span>Опис: </span>
                <span className="text-sm">{m.description || "немає"}</span>
              </p> */}
              <img
                src={Trash.src}
                alt="Delete"
                className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                onClick={() => onDelete(m.id)}
              />
            </div>
            <div className="flex justify-between">
              <p>
                <span>Купівля: </span>
                <span className="text-sm">{m.base_purchase_price} грн</span>
              </p>
              <img
                src={Pen.src}
                alt="Edit"
                className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                onClick={() => onEdit(m)}
              />
            </div>
            <div className="flex justify-between">
              <p>
                <span>Продаж: </span>
                <span className="text-sm">{m.base_selling_price} грн</span>
              </p>
            </div>
          </div>
        </div>
      )}
    />
  );
};
