"use client";
import React, { useMemo, useState } from "react";
import styles from "./ProjectMaterials.module.css";
import { ProjectReportResponse } from "@/types/project";
import { ProjectMaterialsTable } from "./ProjectMaterialsTable/ProjectMaterialsTable";
import { useUser } from "@/context/UserContextProvider";
import { updateMaterial } from "@/api/projects";
import { FormModal } from "@/components/Table/Form/FormModal";
import { ProjectMaterialForm } from "./ProjectMaterialForm/ProjectMaterialForm";
import { TableMaterial } from "@/types/material";
import { UpdateMaterialRequest } from "@/types/project";

interface Props {
  report: ProjectReportResponse;
  tablesTitle?: string;
  tableClassName?: string;
}

export const ProjectMaterialsComplete = ({
  report,
  tablesTitle,
  tableClassName,
}: Props) => {
  const { project } = report;
  const { token } = useUser();

  // normalize API -> TableMaterial
  const initial: TableMaterial[] = (project.materials || []).map((m) => ({
    id: m.id,
    material_id: m.material_id,
    name: m.name,
    description: m.description ?? "",
    base_purchase_price: Number(m.purchase_price) || 0,
    base_selling_price: Number(m.selling_price) || 0,
    base_delivery: Number(m.delivery) || 0,
    remaining_stock: Number(m.remaining_stock) || 0,
    unit: m.unit ?? "-",
    previous_remaining: Number(m.previous_remaining) || 0,
    current_remaining: Number(m.current_remaining) || 0,
    additional_delivery: Number(m.additional_delivery) || 0,
    delivery_quantity: Number(m.delivery_quantity) || 0,
  }));

  const [materialsLocal, setMaterialsLocal] =
    useState<TableMaterial[]>(initial);
  const [currentForm, setCurrentForm] = useState<TableMaterial | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);

  const selection = materialsLocal.map((m) => ({
    materialId: m.id,
    quantity: Number(m.remaining_stock) || 0,
  }));

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  const totalCost = useMemo(
    () =>
      materialsLocal.reduce((sum, m) => {
        const selling = Number(m.base_selling_price) || 0;
        const delivery = Number(m.base_delivery) || 0;
        const qty = Number(m.remaining_stock) || 0;
        return sum + (selling + delivery) * qty;
      }, 0),
    [materialsLocal]
  );

  const openEditModal = (m: TableMaterial) => setCurrentForm({ ...m });

  const saveMaterial = async (form: TableMaterial) => {
    if (!token) return;
    setLoadingSave(true);

    try {
      // prepare payload for API
      const payload: UpdateMaterialRequest = {
        previous_remaining: Number(form.previous_remaining) || 0,
        remaining_stock: Number(form.remaining_stock) || 0,
        current_remaining: Number(form.current_remaining) || 0,
        additional_delivery: Number(form.additional_delivery) || 0,
      };

      await updateMaterial(project.id, form.id, payload, token);

      setMaterialsLocal((prev) =>
        prev.map((m) => (m.id === form.id ? form : m))
      );
      setCurrentForm(null);
    } catch (err) {
      console.error("Помилка при збереженні матеріалу:", err);
    } finally {
      setLoadingSave(false);
    }
  };

  const isValid =
    !!currentForm &&
    currentForm.remaining_stock !== undefined &&
    Number(currentForm.remaining_stock) >= 0;

  return (
    <section className={`${styles.sectionEstimate} mb-[90px] md:mb-[156px]`}>
      <h2 className={`${styles.estimateTytle} mb-[10px] md:mb-[16px]`}>
        {tablesTitle}
      </h2>

      {materialsLocal.length === 0 && (
        <div className={`${styles.totatCostMainTytle} mt-[30px]`}>
          Матеріали відсутні
        </div>
      )}

      {materialsLocal.length > 0 && (
        <>
          <ProjectMaterialsTable
            materials={materialsLocal}
            selection={selection}
            editable={false}
            className={tableClassName}
            onEdit={openEditModal}
          />

          {currentForm && (
            <FormModal
              title="Редагувати матеріал"
              onClose={() => setCurrentForm(null)}
              onSave={() => currentForm && saveMaterial(currentForm)}
              isValid={isValid}
            >
              <ProjectMaterialForm
                form={currentForm}
                setForm={setCurrentForm}
              />
            </FormModal>
          )}

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
      )}
    </section>
  );
};
