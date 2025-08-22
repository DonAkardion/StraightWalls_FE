"use client";
import styles from "./MaterialsEditor.module.css";
import React, { useMemo, useState } from "react";
import { ProjectMaterialsTable } from "@/components/Project/ProjectsDetailed/ProjectMaterialsTable/ProjectMaterialsTable";
import { ProjectMaterial } from "@/types/projectComponents";

function formatNumber(n: number) {
  return n.toFixed(2).replace(".", ",");
}

interface MaterialsEditorProps {
  editable?: boolean;
  tablesTytle?: string;
  materials: ProjectMaterial[];
  onAdd: (material: ProjectMaterial) => void;
  onUpdate: (id: number, updated: ProjectMaterial) => void;
  onDelete: (id: number) => void;
}

export function MaterialsEditor({
  editable = false,
  tablesTytle,
  materials,
  onAdd,
  onUpdate,
  onDelete,
}: MaterialsEditorProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // локальний state для "нового рядка"
  const [newMaterial, setNewMaterial] = useState<
    Omit<ProjectMaterial, "id" | "project_id" | "created_at" | "updated_at">
  >({
    name: "",
    description: "",
    cost: 0,
    quantity: 0,
    unit: "",
    unit_price: 0,
  });

  const total = useMemo(
    () => materials.reduce((acc, m) => acc + m.quantity * m.unit_price, 0),
    [materials]
  );

  const columns = [
    { key: "name", label: "Найменування матеріалів" },
    {
      key: "quantity",
      label: "Кількість",
      render: (m: ProjectMaterial) =>
        editable ? (
          <input
            type="number"
            min={0}
            value={m.quantity}
            onChange={(e) =>
              onUpdate(m.id, { ...m, quantity: Number(e.target.value) })
            }
            className={`${styles.editInput} w-[80px] text-center rounded px-1 py-0`}
          />
        ) : (
          <span>{m.quantity}</span>
        ),
    },
    { key: "unit", label: "Одиниця виміру" },
    {
      key: "unit_price",
      label: "Ціна за одиницю",
      render: (m: ProjectMaterial) =>
        editable ? (
          <input
            type="number"
            min={0}
            value={m.unit_price}
            onChange={(e) =>
              onUpdate(m.id, { ...m, unit_price: Number(e.target.value) })
            }
            className={`${styles.editInput} w-[100px] text-center rounded px-1 py-0`}
          />
        ) : (
          <span>{m.unit_price}</span>
        ),
    },
    {
      key: "total",
      label: "Сума",
      render: (m: ProjectMaterial) => formatNumber(m.quantity * m.unit_price),
    },
    {
      key: "actions",
      label: "",
      render: (m: ProjectMaterial) =>
        editable && (
          <button className="text-red-500" onClick={() => onDelete(m.id)}>
            Видалити
          </button>
        ),
    },
  ];

  const handleInspect = (item: ProjectMaterial) => {
    setExpandedId((prev) => (prev === item.id ? null : item.id));
  };

  const handleAddNew = () => {
    if (!newMaterial.name || newMaterial.quantity <= 0) return;

    onAdd({
      ...newMaterial,
      id: Date.now(),
      project_id: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setNewMaterial({
      name: "",
      description: "",
      cost: 0,
      quantity: 0,
      unit: "",
      unit_price: 0,
    });
  };

  return (
    <section className="relative mb-[40px]">
      <h2 className={`${styles.materialsTytle} mb-[10px] md:mb-[16px]`}>
        {tablesTytle}
      </h2>

      {/* Таблиця матеріалів */}
      <ProjectMaterialsTable
        data={materials}
        columns={columns}
        expandedId={expandedId}
        onInspect={handleInspect}
        enableTooltips={true}
        className="projectMaterialsEditorWrap"
      />

      {/* Рядок для додавання нового матеріалу */}
      {editable && (
        <div className={`${styles.editContainer} flex gap-2 `}>
          <input
            type="text"
            placeholder="Назва"
            value={newMaterial.name}
            onChange={(e) =>
              setNewMaterial((prev) => ({ ...prev, name: e.target.value }))
            }
            className={`${styles.editInput} flex-1 rounded px-2 py-1`}
          />
          <input
            type="number"
            placeholder="Кількість"
            value={newMaterial.quantity || ""}
            onChange={(e) =>
              setNewMaterial((prev) => ({
                ...prev,
                quantity: Number(e.target.value),
              }))
            }
            className={`${styles.editInput} w-[100px] rounded px-2 py-1`}
          />
          <input
            type="text"
            placeholder="Од."
            value={newMaterial.unit}
            onChange={(e) =>
              setNewMaterial((prev) => ({ ...prev, unit: e.target.value }))
            }
            className={`${styles.editInput} w-[80px] rounded px-2 py-1`}
          />
          <input
            type="number"
            placeholder="Ціна"
            value={newMaterial.unit_price || ""}
            onChange={(e) =>
              setNewMaterial((prev) => ({
                ...prev,
                unit_price: Number(e.target.value),
              }))
            }
            className={`${styles.editInput} w-[120px] rounded px-2 py-1`}
          />
          <button
            onClick={handleAddNew}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Додати
          </button>
        </div>
      )}

      {/* Загальна вартість */}
      <div className={`${styles.materialTotalCostWrap} relative`}>
        <div
          className={`${styles.materialTotalCostBlock} md:absolute md:top-[-8px] mt-4 md:mt-0 md:w-full h-[56px] md:h-[74px] z-[10] rounded-[5px]`}
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
