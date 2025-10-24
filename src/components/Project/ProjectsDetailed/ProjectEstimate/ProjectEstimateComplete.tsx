"use client";
import React, { useMemo, useState } from "react";
import styles from "./ProjectEstimate.module.css";
import { ProjectReportResponse } from "@/types/project";
import { ProjectServicesTable } from "./ProjectEstimateTable/ProjectServicesTable";
import { useUser } from "@/context/UserContextProvider";
import { UpdateWorkRequest } from "@/types/project";
import { updateWork } from "@/api/projects";
import { FormModal } from "@/components/Table/Form/FormModal";
import { EstimateFormModal } from "./EstimateFormModal/EstimateFormModal";

interface Props {
  report: ProjectReportResponse;
  tablesTitle?: string;
  tableClassName?: string;
  role?: string;
}

export interface WorkForTable {
  id: number;
  name: string;
  unit_of_measurement: string;
  price: number;
  is_active: boolean;
  quantity?: number;
  salary: number;
}

export const ProjectEstimateComplete = ({
  report,
  tablesTitle,
  tableClassName,
  role,
}: Props) => {
  const { project } = report;
  const { token } = useUser();
  const services = project.works;

  const servicesForTable: WorkForTable[] = services.map((w) => ({
    id: w.id,
    name: w.name,
    price: Number(w.cost),
    unit_of_measurement: w.unit ?? "-",
    is_active: true,
    quantity: w.quantity,
    salary: w.salary ?? "-",
  }));

  const [worksLocal, setWorksLocal] =
    useState<WorkForTable[]>(servicesForTable);
  const [currentForm, setCurrentForm] = useState<WorkForTable | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);

  const selection = worksLocal.map((s) => ({
    serviceId: s.id,
    quantity: Number(s.quantity) || 0,
  }));

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  const totalCost = useMemo(
    () =>
      worksLocal.reduce(
        (sum, s) => sum + Number(s.price) * (s.quantity || 0),
        0
      ),
    [worksLocal]
  );

  const openEditModal = (w: WorkForTable) => setCurrentForm({ ...w });

  const saveWork = async (form: WorkForTable) => {
    if (!token) return;
    setLoadingSave(true);

    try {
      // prepare payload for API
      const payload: UpdateWorkRequest = {
        quantity: Number(form.quantity) || 0,
        cost: Number(form.price) || 0,
      };

      await updateWork(project.id, form.id, payload, token);

      setWorksLocal((prev) =>
        prev.map((w) =>
          w.id === form.id ? { ...form, price: Number(form.price) } : w
        )
      );
      setCurrentForm(null);
    } catch (err) {
      console.error("Помилка при збереженні Послуги:", err);
    } finally {
      setLoadingSave(false);
    }
  };

  const isValid =
    !!currentForm &&
    currentForm.quantity !== undefined &&
    Number(currentForm.quantity) >= 0;

  return (
    <section
      className={`${styles.sectionEstimate} mt-[40px] md:mt-[30px] mb-[90px] md:mb-[116px]`}
    >
      <h2 className={`${styles.estimateTytle} mb-[10px] md:mb-[16px]`}>
        {tablesTitle}
      </h2>
      {worksLocal.length == 0 && (
        <div className={`${styles.totatCostMainTytle} mt-[30px]`}>
          Послуги відсутні
        </div>
      )}
      {worksLocal.length > 0 && (
        <div>
          <ProjectServicesTable
            services={worksLocal}
            selection={selection}
            editable={false}
            className={tableClassName}
            onEdit={
              role === "admin" || role === "accountant"
                ? openEditModal
                : undefined
            }
          />
          {currentForm && (
            <FormModal
              title="Редагувати послугу"
              onClose={() => setCurrentForm(null)}
              onSave={() => currentForm && saveWork(currentForm)}
              isValid={isValid}
            >
              <EstimateFormModal form={currentForm} setForm={setCurrentForm} />
            </FormModal>
          )}
          <div
            className={`${styles.tableBetweenWrapSecond} relative h-[60px] md:h-[48px] w-full z-[10]`}
          >
            <div
              className={`${styles.totatCostMain} ${styles.totatCostMainSwadow} flex justify-between items-center mt-[16px] gap-2 h-[60px] md:h-[74px] w-full rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]`}
            >
              <div className={`${styles.totatCostMainTytle}`}>
                Загальна вартість робіт
              </div>
              <div className={`${styles.totatCostMainSum} shrink-0`}>
                {formatNumber(totalCost)} грн
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
