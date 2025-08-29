"use client";
import React, { useMemo } from "react";
import styles from "./ProjectEstimate.module.css";
import { ProjectReportResponse } from "@/types/project";
import { ProjectServicesTable } from "./ProjectEstimateTable/ProjectServicesTable";
import { ProjectWork } from "@/types/projectComponents";

interface Props {
  report: ProjectReportResponse;
  tablesTitle?: string;
}

interface WorkForTable {
  id: number;
  name: string;
  unit_of_measurement: string;
  price: number;
  is_active: boolean;
  quantity: number;
}

export const ProjectEstimateComplete = ({ report, tablesTitle }: Props) => {
  const { project } = report;
  const services = project.works;

  const servicesForTable: WorkForTable[] = project.works.map((w) => ({
    id: w.id,
    name: w.name,
    unit_of_measurement: w.unit ?? "-",
    price: Number(w.cost),
    is_active: true,
    quantity: w.quantity,
  }));

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  const totalCost = useMemo(
    () => services.reduce((sum, s) => sum + Number(s.cost) * s.quantity, 0),
    [services]
  );

  const columns = [
    { key: "name", label: "Найменування послуги" },
    { key: "quantity", label: "Кількість" },
    { key: "cost", label: "Вартість, грн" },
    {
      key: "sum",
      label: "Сума, грн",
      render: (s: ProjectWork) => (Number(s.cost) * s.quantity).toFixed(2),
    },
  ];

  return (
    <section className={`${styles.sectionEstimate} mb-[90px] md:mb-[156px]`}>
      <h2 className={`${styles.estimateTytle} mb-[10px] md:mb-[16px]`}>
        {tablesTitle}
      </h2>

      <ProjectServicesTable
        services={servicesForTable as any} // привід TypeScript
        selection={servicesForTable.map((s) => ({
          serviceId: s.id,
          quantity: s.quantity,
        }))}
        editable={false}
        className="..."
      />
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
    </section>
  );
};
