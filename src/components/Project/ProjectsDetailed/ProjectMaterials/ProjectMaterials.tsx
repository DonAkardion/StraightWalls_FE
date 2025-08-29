"use client";

import React, { useMemo } from "react";
import styles from "./ProjectMaterials.module.css";
import { ProjectMaterialsTable } from "../ProjectMaterialsTable/ProjectMaterialsTable";
import { ProjectReportResponse } from "@/types/project";

interface Props {
  report: ProjectReportResponse;
}

export function ProjectMaterials({ report }: Props) {
  const { project } = report;
  const materials = project.materials.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
    purchase_price: Number(m.purchase_price),
    selling_price: Number(m.selling_price),
    remaining_stock: Number(m.remaining_stock),
    delivery: Number(m.delivery),
    unit: m.unit,
  }));

  const totalCost = useMemo(
    () =>
      materials.reduce(
        (sum, m) => sum + m.selling_price * m.remaining_stock,
        0
      ),
    [materials]
  );

  return (
    <section className="relative md:mb-[120px] mb-[40px]">
      <h2 className={`${styles.materialTytle} mb-[16px]`}>Матеріали</h2>

      <ProjectMaterialsTable
        data={materials.map((m) => ({
          ...m,
          project_id: report.project.id,
          quantity: m.delivery,
          total: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))}
        className="projectDetailedMaterialsWrap"
      />

      <div
        className={`${styles.totatCostSeparate} md:absolute md:bottom-[-60px] w-full mt-[15px] md:mt-0 z-[10] rounded-[5px]`}
      >
        <div
          className={`${styles.totatCostMain} flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]`}
        >
          <div className={`${styles.totatCostMainTytle}`}>
            Загальна вартість матеріалів
          </div>
          <div className={`${styles.totatCostMainSum} shrink-0`}>
            {totalCost.toFixed(2).replace(".", ",")} грн
          </div>
        </div>
      </div>
    </section>
  );
}
