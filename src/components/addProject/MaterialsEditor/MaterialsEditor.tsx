"use client";
import styles from "./MaterialsEditor.module.css";
import React, { useMemo, useState } from "react";
import { ProjectMaterialsTable } from "@/components/Project/ProjectsDetailed/ProjectMaterialsTable/ProjectMaterialsTable";
import { mockMaterials } from "@/mock/Materials/materialsMock";
import { Material } from "@/types/material";

function parsePrice(price: string) {
  return Number(String(price).replace(",", "."));
}
function formatNumber(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export function MaterialsEditor() {
  // Локальна копія матеріалів з моковими delivery
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const total = useMemo(
    () => materials.reduce((acc, m) => acc + m.amount * parsePrice(m.price), 0),
    [materials]
  );

  const changeAmount = (id: string, next: number) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, amount: Math.max(0, Math.floor(next)) } : m
      )
    );
  };

  const columns = [
    { key: "name", label: "Найменування матеріалів" },
    {
      key: "amount",
      label: "Кількість",
      render: (m: Material) => (
        <div
          className="flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              changeAmount(m.id, Math.max(0, m.amount - 1));
            }}
            className="hidden md:inline-flex w-4 h-4 pb-[3px] items-center justify-center bg-white rounded cursor-pointer"
            aria-label="decrease"
          >
            −
          </button>

          <input
            type="number"
            min={0}
            value={m.amount === 0 ? "" : m.amount}
            onChange={(e) => {
              e.stopPropagation();
              const v = e.target.value === "" ? 0 : Number(e.target.value);
              if (Number.isNaN(v)) return;
              changeAmount(m.id, v);
            }}
            onClick={(e) => e.stopPropagation()}
            className={`${styles.editInput} w-[80px] md:w-12 text-center rounded px-1 py-0`}
            placeholder="0"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              changeAmount(m.id, m.amount + 1);
            }}
            className="hidden md:inline-flex w-4 h-4 pb-[3px] items-center justify-center bg-white rounded cursor-pointer"
            aria-label="increase"
          >
            +
          </button>
        </div>
      ),
    },
    {
      key: "stock", // унікальний ключ, не amount
      label: "Залишок",
      render: (m: Material) => String(m.amount),
    },
    {
      key: "delivery",
      label: "Доставка",
      render: (m: Material) => m.delivery ?? "",
    },
    {
      // окрема колонка для кнопки інспекту — повністю керуємо розгортанням через expandedId
      key: "inspect",
      label: "",
      render: (m: Material) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpandedId((prev) => (prev === m.id ? null : m.id));
          }}
          className="px-2 py-1 rounded border"
          aria-expanded={expandedId === m.id}
        >
          {expandedId === m.id ? "Згорнути" : "Деталі"}
        </button>
      ),
    },
  ];

  const handleInspect = (item: Material) => {
    setExpandedId((prev) => (prev === item.id ? null : item.id));
  };

  return (
    <section className="relative mb-[40px]">
      <h2 className="mb-[16px] text-[20px]">Матеріали</h2>

      <ProjectMaterialsTable
        data={materials}
        columns={columns}
        expandedId={expandedId}
        onInspect={handleInspect}
        enableTooltips={true}
        className="projectMaterialsEditorWrap"
      />
      <div className={`${styles.materialTotalCostWrap} relative`}>
        <div
          className={`${styles.materialTotalCostBlock} md:absolute md:top-[-10px] mt-4 md:mt-0 md:w-full h-[56px] md:h-[74px] z-[10] rounded-[5px]`}
        >
          <div
            className={`${styles.materialTotalCost}  rounded-[5px] p-4 h-[56px] md:h-[74px] flex justify-between items-center`}
          >
            <div className={`${styles.materialTotalCostTytle}`}>
              Загальна вартість матеріалів
            </div>
            <div className={`${styles.materialTotalCostSum}`}>
              {formatNumber(total)} грн
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
