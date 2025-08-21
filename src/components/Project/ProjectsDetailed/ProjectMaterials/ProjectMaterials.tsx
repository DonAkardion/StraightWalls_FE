"use client";

import React, { useState } from "react";
import styles from "./ProjectMaterials.module.css";
import { ProjectMaterialsTable } from "../ProjectMaterialsTable/ProjectMaterialsTable";
import { Material } from "@/types/material";

export function ProjectMaterials() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const handleInspect = (item: Material) => {
    setExpandedId((prev) => (prev === item.id ? null : item.id));
  };
  return (
    <section className="relative md:mb-[120px] mb-[40px]">
      <h2 className={`${styles.materialTytle} mb-[16px]`}>Матеріали </h2>
      <ProjectMaterialsTable
        expandedId={expandedId}
        onInspect={handleInspect}
        className="projectDetailedMaterialsWrap"
      />
      <div
        className={`${styles.totatCostSeparate} md:absolute md:bottom-[-60px] w-full mt-[15px] md:mt-0 z-[10] rounded-[5px] `}
      >
        <div
          className={`${styles.totatCostMain}  flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]  `}
        >
          <div className={`${styles.totatCostMainTytle} `}>
            Загальна вартість матеріалів
          </div>
          <div className={`${styles.totatCostMainSum} shrink-0 `}>
            39 317,5 грн
          </div>
        </div>
      </div>
    </section>
  );
}
