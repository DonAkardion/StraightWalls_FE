"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ProjectMaterials.module.css";
import { ProjectReportResponse } from "@/types/project";
import { ProjectMaterialsTable } from "./ProjectMaterialsTable/ProjectMaterialsTable";
import { useUser } from "@/context/UserContextProvider";
import { updateMaterial, addMaterialToProject } from "@/api/projects";
import { getMaterials } from "@/api/material";
import { TableMaterial } from "@/types/material";
import { UpdateMaterialRequest } from "@/types/project";

interface Props {
  report: ProjectReportResponse;
  tablesTitle?: string;
  tableClassName?: string;
  role?: string;
}

export const ProjectMaterialsComplete = ({
  report,
  tablesTitle,
  tableClassName,
  role,
}: Props) => {
  const { project } = report;
  const { token } = useUser();

  const [materialsLocal, setMaterialsLocal] = useState<TableMaterial[]>([]);
  const [allMaterials, setAllMaterials] = useState<TableMaterial[]>([]);
  const [allMaterialsDraft, setAllMaterialsDraft] = useState<TableMaterial[]>(
    []
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const handleToggleEditMode = async () => {
    if (!isEditMode) {
      // копія з поточних матеріалів у чернетку
      setAllMaterialsDraft(JSON.parse(JSON.stringify(materialsLocal)));
      setIsEditMode(true);
    } else {
      // вихід без збереження
      setIsEditMode(false);
    }
  };

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  // --- Ініціалізація поточних матеріалів проєкту ---
  useEffect(() => {
    if (!project?.materials) return;

    const initial: TableMaterial[] = project.materials.map((m) => {
      const rs = Number(m.remaining_stock) || 0;
      return {
        id: m.id,
        material_id: m.material_id,
        name: m.name,
        description: m.description ?? "",
        base_purchase_price: Number(m.purchase_price) || 0,
        base_selling_price: Number(m.selling_price) || 0,
        base_delivery: Number(m.delivery) || 0,
        remaining_stock: rs,
        quantity: rs,
        unit: m.unit ?? "-",
        previous_remaining: Number(m.previous_remaining) || 0,
        current_remaining: Number(m.current_remaining) || 0,
        additional_delivery: Number(m.additional_delivery) || 0,
        delivery_quantity: Number(m.delivery_quantity) || 0,
      };
    });
    setMaterialsLocal(initial);
  }, [project]);

  // --- Підвантажити всі матеріали при активації режиму редагування ---
  useEffect(() => {
    if (!isEditMode || !token) return;

    const loadAllMaterials = async () => {
      setLoadingAll(true);
      try {
        const materials = await getMaterials(token);

        const merged: TableMaterial[] = materials.map((m) => {
          const existing = materialsLocal.find(
            (pm) => pm.material_id === m.id || pm.id === m.id
          );

          // якщо матеріал вже є в проєкті -> беремо його поточні цифри
          if (existing) {
            return {
              id: existing.id, // id рядка в project_materials
              material_id: existing.material_id,
              name: existing.name ?? m.name,
              description: existing.description ?? m.description ?? "",
              base_purchase_price:
                existing.base_purchase_price ??
                Number(m.base_purchase_price) ??
                0,
              base_selling_price:
                existing.base_selling_price ??
                Number(m.base_selling_price) ??
                0,
              base_delivery:
                existing.base_delivery ?? Number(m.base_delivery) ?? 0,

              // ці значення є живими в проєкті
              remaining_stock: Number(existing.remaining_stock) || 0,
              quantity: Number(existing.remaining_stock) || 0, // 👈 головне
              previous_remaining: Number(existing.previous_remaining) || 0,
              current_remaining: Number(existing.current_remaining) || 0,
              additional_delivery: Number(existing.additional_delivery) || 0,
              delivery_quantity: Number(existing.delivery_quantity) || 0,

              unit: existing.unit ?? m.unit ?? "-",
            };
          }

          // якщо матеріалу ще немає в проєкті -> це "кандидат"
          return {
            id: m.id, // тимчасово локальне id (ідентифікатор зі складу)
            material_id: m.id,
            name: m.name,
            description: m.description ?? "",
            base_purchase_price: Number(m.base_purchase_price) ?? 0,
            base_selling_price: Number(m.base_selling_price) ?? 0,
            base_delivery: Number(m.base_delivery) ?? 0,

            // новий матеріал ще не доданий -> 0
            remaining_stock: 0,
            quantity: 0,
            previous_remaining: 0,
            current_remaining: 0,
            additional_delivery: 0,
            delivery_quantity: 0,

            unit: m.unit ?? "-",
          };
        });

        setAllMaterials(merged);
      } catch (error) {
        console.error("Помилка завантаження матеріалів:", error);
      } finally {
        setLoadingAll(false);
      }
    };

    loadAllMaterials();
  }, [isEditMode, token, materialsLocal]);

  const handleQuantityChange = (
    materialId: number,
    field: keyof TableMaterial,
    value: number
  ) => {
    setAllMaterials((prev) =>
      prev.map((m) => {
        if (m.material_id === materialId || m.id === materialId) {
          if (field === "quantity") {
            return {
              ...m,
              quantity: value,
              remaining_stock: value,
            };
          }
          return { ...m, [field]: value };
        }
        return m;
      })
    );
  };

  const totalCost = useMemo(() => {
    const list = isEditMode ? allMaterials : materialsLocal;
    return list.reduce((sum, m) => {
      const qty = Number(m.remaining_stock) || 0;
      return sum + Number(m.base_purchase_price) * qty;
    }, 0);
  }, [materialsLocal, allMaterials, isEditMode]);

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  // --- Збереження змін ---
  const handleSaveChanges = async () => {
    if (!token) return;
    setLoadingSave(true);

    try {
      const materialsToSave = allMaterials.filter(
        (m) => Number(m.remaining_stock) > 0
      );

      for (const mat of materialsToSave) {
        const qty = Number(mat.remaining_stock) || 0;

        const exists = materialsLocal.find(
          (m) => m.material_id === mat.material_id
        );

        if (exists) {
          // оновлюємо існуючий рядок project_materials
          const payload: UpdateMaterialRequest = {
            purchase_price: Number(mat.base_purchase_price) || 0,
            previous_remaining: Number(mat.previous_remaining) || 0,
            remaining_stock: qty,
            current_remaining: Number(mat.current_remaining) || 0,
            additional_delivery: Number(mat.additional_delivery) || 0,
          };

          await updateMaterial(project.id, exists.id, payload, token);

          // локально оновимо materialsLocal
          // щоб після збереження перейти назад в режим перегляду з актуальними цифрами
        } else {
          // додаємо новий матеріал у проект
          const newMat = {
            material_id: mat.material_id,
            name: mat.name,
            purchase_price: String(mat.base_purchase_price),
            selling_price: String(mat.base_selling_price ?? 0),
            remaining_stock: String(qty),
            additional_delivery: String(mat.additional_delivery ?? 0),
            current_remaining: String(mat.current_remaining ?? 0),
            previous_remaining: String(mat.previous_remaining ?? 0),
            delivery: String(mat.base_delivery ?? 0),
            unit: mat.unit ?? "-",
          };

          await addMaterialToProject(project.id, [newMat], token);
        }
      }

      // оновлюємо локальний стейт materialsLocal на основі allMaterials (але беремо тільки ті, де qty > 0)
      const updatedView = allMaterials
        .filter((m) => Number(m.remaining_stock) > 0)
        .map((m) => {
          const rs = Number(m.remaining_stock) || 0;
          return {
            ...m,
            remaining_stock: rs,
            quantity: rs,
          };
        });

      setMaterialsLocal(
        allMaterialsDraft.filter((m) => Number(m.remaining_stock) > 0)
      );
      setIsEditMode(false);
    } catch (error) {
      console.error("❌ Помилка збереження матеріалів:", error);
      alert("Не вдалося зберегти зміни матеріалів");
    } finally {
      setLoadingSave(false);
    }
  };

  // --- Вибір таблиці ---
  const tableMaterials = isEditMode ? allMaterials : materialsLocal;

  const selectionData = tableMaterials.map((m) => ({
    materialId: m.material_id,
    quantity: Number(m.quantity) || Number(m.remaining_stock) || 0,
  }));

  return (
    <section className={`${styles.sectionEstimate} mb-[30px] md:mb-[56px]`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`${styles.estimateTytle}`}>
          {tablesTitle ?? "Матеріали"}
        </h2>

        {(role === "admin" || role === "accountant") && (
          <button
            onClick={handleToggleEditMode}
            className="border-2 border-green-400 px-4 py-1 rounded hover:bg-green-100 transition"
          >
            {isEditMode ? "Скасувати" : "Редагувати матеріали"}
          </button>
        )}
      </div>

      {isEditMode ? (
        loadingAll ? (
          <p>Завантаження матеріалів...</p>
        ) : (
          <>
            <ProjectMaterialsTable
              materials={tableMaterials}
              selection={selectionData}
              editable
              onQuantityChange={handleQuantityChange}
              className="projectDetailedMaterialsCompleteEdit"
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveChanges}
                disabled={loadingSave}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-60"
              >
                {loadingSave ? "Збереження..." : "Зберегти зміни"}
              </button>
            </div>
          </>
        )
      ) : materialsLocal.length > 0 ? (
        <>
          <ProjectMaterialsTable
            materials={tableMaterials}
            selection={selectionData}
            editable={false}
            className={tableClassName}
            onEdit={
              role === "admin" || role === "accountant" ? undefined : undefined
            }
          />

          <div
            className={`${styles.tableBetweenWrapSecond} relative h-[60px] md:h-[48px] w-full z-[10]`}
          >
            <div
              className={`${styles.totatCostMain} ${styles.totatCostMainSwadow} flex justify-between items-center mt-[16px] gap-2 h-[60px] md:h-[74px] w-full rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]`}
            >
              <div className={styles.totatCostMainTytle}>
                Загальна вартість матеріалів
              </div>
              <div className={`${styles.totatCostMainSum} shrink-0`}>
                {formatNumber(totalCost)} грн
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`${styles.totatCostMainTytle} mt-[30px]`}>
          Матеріали відсутні
        </div>
      )}
    </section>
  );
};
