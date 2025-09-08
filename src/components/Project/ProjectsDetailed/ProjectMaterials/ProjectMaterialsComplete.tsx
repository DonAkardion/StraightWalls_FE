"use client";
import React, { useMemo } from "react";
import styles from "./ProjectMaterials.module.css";
import { ProjectReportResponse } from "@/types/project";
import { ProjectMaterialsTable } from "./ProjectMaterialsTable/ProjectMaterialsTable";
import { ProjectMaterial } from "@/types/projectComponents";

interface Props {
  report: ProjectReportResponse;
  tablesTitle?: string;
  tableClassName?: string;
}

interface MaterialForTable {
  id: number;
  name: string;
  base_purchase_price: number;
  base_selling_price: number;
  margin: string;
  remaining_stock: number;
  base_delivery: string;
  unit: string;
}

export const ProjectMaterialsComplete = ({
  report,
  tablesTitle,
  tableClassName,
}: Props) => {
  const { project } = report;
  const materials = project.materials;

  const materialsForTable: MaterialForTable[] = project.materials.map((m) => ({
    id: m.id,
    name: m.name,
    base_purchase_price: Number(m.purchase_price),
    base_selling_price: Number(m.selling_price),
    margin: m.margin,
    remaining_stock: Number(m.remaining_stock),
    base_delivery: m.delivery,
    unit: m.unit ?? "-",
  }));

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  const totalCost = useMemo(() => {
    return materialsForTable.reduce((sum, m) => {
      const selling = Number(m.base_selling_price) || 0;
      const delivery = Number(m.base_delivery) || 0;
      const qty = Number(m.remaining_stock) || 0;
      return sum + (selling + delivery) * qty;
    }, 0);
  }, [materialsForTable]);

  return (
    <section className={`${styles.sectionEstimate} mb-[90px] md:mb-[156px]`}>
      <h2 className={`${styles.estimateTytle} mb-[10px] md:mb-[16px]`}>
        {tablesTitle}
      </h2>

      <ProjectMaterialsTable
        materials={materialsForTable as any}
        selection={materialsForTable.map((m) => ({
          materialId: m.id,
          quantity: m.remaining_stock,
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
            Загальна вартість матеріалів
          </div>
          <div className={`${styles.totatCostMainSum} shrink-0`}>
            {formatNumber(totalCost)} грн
          </div>
        </div>
      </div>
    </section>
  );
};
