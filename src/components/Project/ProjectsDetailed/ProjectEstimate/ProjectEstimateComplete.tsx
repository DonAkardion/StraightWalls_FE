"use client";
import React, { useMemo } from "react";
import styles from "./ProjectEstimate.module.css";
import { ProjectReportResponse } from "@/types/project";
import { ProjectServicesTable } from "./ProjectEstimateTable/ProjectServicesTable";
import { ProjectWork } from "@/types/projectComponents";

interface Props {
  report: ProjectReportResponse;
  tablesTitle?: string;
  tableClassName?: string;
}

interface WorkForTable {
  id: number;
  name: string;
  unit_of_measurement: string;
  price: number;
  is_active: boolean;
  quantity: number;
}

export const ProjectEstimateComplete = ({
  report,
  tablesTitle,
  tableClassName,
}: Props) => {
  const { project } = report;
  const services = project.works;

  const servicesForTable: WorkForTable[] = project.works.map((w) => ({
    id: w.id,
    name: w.name,
    price: Number(w.cost),
    unit_of_measurement: w.unit ?? "-",
    is_active: true,
    quantity: w.quantity,
  }));

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  const totalCost = useMemo(
    () => services.reduce((sum, s) => sum + Number(s.cost), 0),
    [services]
  );

  return (
    <section className={`${styles.sectionEstimate} mb-[90px] md:mb-[156px]`}>
      <h2 className={`${styles.estimateTytle} mb-[10px] md:mb-[16px]`}>
        {tablesTitle}
      </h2>
      {servicesForTable.length == 0 && (
        <div className={`${styles.totatCostMainTytle} mt-[30px]`}>
          Послуги відсутні
        </div>
      )}
      {servicesForTable.length > 0 && (
        <div>
          <ProjectServicesTable
            services={servicesForTable as any}
            selection={servicesForTable.map((s) => ({
              serviceId: s.id,
              quantity: s.quantity,
            }))}
            editable={false}
            className={tableClassName}
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
        </div>
      )}
    </section>
  );
};
