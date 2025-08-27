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
  onAdd?: (material: ProjectMaterial) => void;
  onUpdate?: (id: number, updated: ProjectMaterial) => void;
  onDelete?: (id: number) => void;
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
    purchase_price: 0,
    selling_price: 0,
    quantity: 0,
    remaining_stock: 0,
    delivery: 0,
    unit: "",
    total: 0,
  });

  // Сумарна вартість матеріалів (по закупці + доставка)
  const total = useMemo(
    () =>
      materials.reduce(
        (acc, m) => acc + m.selling_price * m.quantity + m.delivery,
        0
      ),
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
              editable && onUpdate
                ? onUpdate(m.id, { ...m, quantity: Number(e.target.value) })
                : null
            }
            className={`${styles.editInput} w-[80px] text-center rounded px-1 py-0`}
          />
        ) : (
          <span>{m.quantity}</span>
        ),
    },
    { key: "unit", label: "Од. вимір." },
    {
      key: "purchase_price",
      label: "Купівля, грн",
      // render: (m: ProjectMaterial) =>
      //   editable ? (
      //     <input
      //       type="number"
      //       min={0}
      //       value={m.purchase_price}
      //       onChange={(e) =>
      //         editable && onUpdate
      //           ? onUpdate(m.id, {
      //               ...m,
      //               purchase_price: Number(e.target.value),
      //             })
      //           : null
      //       }
      //       className={`${styles.editInput} w-[100px] text-center rounded px-1 py-0`}
      //     />
      //   ) : (
      //     <span>{m.purchase_price}</span>
      //   ),
    },
    {
      key: "selling_price",
      label: "Продаж, грн",
      // render: (m: ProjectMaterial) =>
      //   editable ? (
      //     <input
      //       type="number"
      //       min={0}
      //       value={m.selling_price}
      //       onChange={(e) =>
      //         editable && onUpdate
      //           ? onUpdate(m.id, {
      //               ...m,
      //               selling_price: Number(e.target.value),
      //             })
      //           : null
      //       }
      //       className={`${styles.editInput} w-[100px] text-center rounded px-1 py-0`}
      //     />
      //   ) : (
      //     <span>{m.selling_price}</span>
      //   ),
    },
    {
      key: "delivery",
      label: "Доставка, грн",
      // render: (m: ProjectMaterial) =>
      //   editable ? (
      //     <input
      //       type="number"
      //       min={0}
      //       value={m.delivery}
      //       onChange={(e) =>
      //         editable && onUpdate
      //           ? onUpdate(m.id, { ...m, delivery: Number(e.target.value) })
      //           : null
      //       }
      //       className={`${styles.editInput} w-[100px] text-center rounded px-1 py-0`}
      //     />
      //   ) : (
      //     <span>{m.delivery}</span>
      //   ),
    },
    {
      key: "total",
      label: "Сума",
      render: (m: ProjectMaterial) =>
        formatNumber(m.selling_price * m.quantity + m.delivery),
    },
  ];

  const handleInspect = (item: ProjectMaterial) => {
    setExpandedId((prev) => (prev === item.id ? null : item.id));
  };

  const handleAddNew = () => {
    if (!newMaterial.name || newMaterial.quantity <= 0) return;

    if (onAdd) {
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
        purchase_price: 0,
        selling_price: 0,
        quantity: 0,
        remaining_stock: 0,
        delivery: 0,
        unit: "",
        total: 0,
      });
    }
  };

  return (
    <section className="relative mb-[40px]">
      <h2 className={`${styles.materialsTytle} mb-[10px] md:mb-[16px]`}>
        {tablesTytle}
      </h2>

      {materials.length > 0 && (
        <ProjectMaterialsTable
          data={materials}
          columns={columns}
          expandedId={expandedId}
          onInspect={handleInspect}
          onDelete={
            editable && onDelete
              ? (material) => onDelete(material.id)
              : undefined
          }
          enableTooltips={true}
          className="projectMaterialsEditorWrap"
        />
      )}

      {editable && (
        <div
          className={`${styles.inputModule} mt-[16px] mb-[20px] rounded-[5px]`}
        >
          <div
            className={`${styles.inputModuleTytle} pl-[36px] flex items-center h-[76px] w-full rounded-[5px] `}
          >
            <h3 className="">Створити Матеріал</h3>
          </div>
          <div
            className={`${styles.editContainer} grid grid-cols-2 gap-3 p-4 pb-0 `}
          >
            <input
              type="text"
              placeholder="Назва"
              value={newMaterial.name}
              onChange={(e) =>
                setNewMaterial((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`${styles.editInput} max-w-[90%] flex-1 px-2 py-1 border-b-1 col-span-2`}
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
              className={`${styles.editInput} flex-1 max-w-[80%] px-2 py-1 border-b-1`}
            />
            <input
              type="text"
              placeholder="Од."
              value={newMaterial.unit}
              onChange={(e) =>
                setNewMaterial((prev) => ({ ...prev, unit: e.target.value }))
              }
              className={`${styles.editInput} flex-1 max-w-[80%] px-2 py-1 border-b-1`}
            />
            <input
              type="number"
              placeholder="Ціна закупки"
              value={newMaterial.purchase_price || ""}
              onChange={(e) =>
                setNewMaterial((prev) => ({
                  ...prev,
                  purchase_price: Number(e.target.value),
                }))
              }
              className={`${styles.editInput} flex-1 max-w-[80%] px-2 py-1 border-b-1`}
            />
            <input
              type="number"
              placeholder="Ціна продажу"
              value={newMaterial.selling_price || ""}
              onChange={(e) =>
                setNewMaterial((prev) => ({
                  ...prev,
                  selling_price: Number(e.target.value),
                }))
              }
              className={`${styles.editInput} flex-1 max-w-[80%] px-2 py-1 border-b-1`}
            />
            <input
              type="number"
              placeholder="Доставка"
              value={newMaterial.delivery || ""}
              onChange={(e) =>
                setNewMaterial((prev) => ({
                  ...prev,
                  delivery: Number(e.target.value),
                }))
              }
              className={`${styles.editInput} flex-1 max-w-[80%] px-2 py-1 border-b-1`}
            />
          </div>
          {editable && onAdd && (
            <div className="flex justify-end pb-4 pr-[40px]">
              <button
                onClick={handleAddNew}
                className={`${styles.editInputBtn} w-[40%] min-w-[120px] max-w-[260px] h-[40px] ml-[10px] px-4 py-1 rounded-[5px] cursor-pointer`}
              >
                Додати
              </button>
            </div>
          )}
        </div>
      )}

      {materials.length > 0 && (
        <div className={`${styles.materialTotalCostWrap} relative`}>
          <div
            className={`${styles.materialTotalCostBlock} md:absolute md:top-[-8px] mt-4 md:mt-0 md:w-full h-[56px] md:h-[74px] z-[10] rounded-[5px]`}
          >
            <div
              className={`${styles.materialTotalCost} rounded-[5px] p-4 h-[56px] md:h-[74px] flex justify-between items-center`}
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
      )}
    </section>
  );
}
