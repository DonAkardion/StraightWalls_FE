"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate.module.css";
import { MaterialIncome } from "@/types/materialIncome";
import { MaterialIncomeTable } from "./MaterialIncomeTable/MaterialIncomeTable";

interface Props {
  materialsIncome: MaterialIncome[];
  editable?: boolean;
  onMaterialsIncomeChange?: (materials: MaterialIncome[]) => void;
  tableClassName?: string;
}

export const MaterialIncomeEditor = ({
  materialsIncome,
  editable = false,
  onMaterialsIncomeChange,
  tableClassName,
}: Props) => {
  const [localMaterialsIncome, setLocalMaterialsIncome] =
    useState<MaterialIncome[]>(materialsIncome);

  // синхронізація зі змінами зовнішніх даних
  useEffect(() => {
    setLocalMaterialsIncome(materialsIncome);
  }, [materialsIncome]);

  const handleAmountChange = (id: string, newAmount: number) => {
    setLocalMaterialsIncome((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, amount: newAmount } : m
      );
      if (onMaterialsIncomeChange) onMaterialsIncomeChange(updated);
      return updated;
    });
  };

  const mainMaterialsIncome = useMemo(
    () =>
      localMaterialsIncome.filter((m) => m.serviceType === "Основні послуги"),
    [localMaterialsIncome]
  );

  const additionalMaterialsIncome = useMemo(
    () =>
      localMaterialsIncome.filter((m) => m.serviceType === "Додаткові роботи"),
    [localMaterialsIncome]
  );

  return (
    <section className={`${styles.sectionMaterials} mb-[40px]  md:mt-[126px]`}>
      <h2 className={`${styles.editorTitle} mb-[16px]`}>
        Заробіток на матеріалах
      </h2>
      <div>
        <MaterialIncomeTable
          materials={mainMaterialsIncome}
          editable={editable}
          onAmountChange={handleAmountChange}
          className={tableClassName}
        />

        <div
          className={`${styles.tableBetweenWrap} relative h-[126px] md:h-[48px] w-full z-[10]`}
        >
          <div
            className={`${styles.totatCostSeparate} absolute top-[16%] md:top-[-14%] md:h-[142px] w-full z-[10] rounded-[5px]`}
          >
            <div
              className={`${styles.totatCostMain} flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full z-[11] rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]  `}
            >
              <div className={`${styles.totatCostMainTytle} `}>
                Загальний заробіток на матеріалах
              </div>
              <div className={`${styles.totatCostMainSum} shrink-0 `}>
                39 317,5 грн
              </div>
            </div>
            <h3
              className={`${styles.totatCostSeparateTytle} md:pl-[36px] md:pt-[40px] pt-[10px]`}
            >
              Додаткові роботи
            </h3>
          </div>
        </div>

        <MaterialIncomeTable
          materials={additionalMaterialsIncome}
          editable={editable}
          onAmountChange={handleAmountChange}
          className={tableClassName}
        />
        <div
          className={`${styles.tableBetweenWrap} relative h-[60px] md:h-[48px] w-full z-[10]`}
        >
          <div
            className={`${styles.totatCostSeparate} md:absolute md:bottom-[-20px] w-full mt-[15px] md:mt-0 z-[10] rounded-[5px] `}
          >
            <div
              className={`${styles.totatCostMain}  flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]  `}
            >
              <div className={`${styles.totatCostMainTytle} `}>
                Загальний заробіток на матеріалах з додаткових робіт
              </div>
              <div className={`${styles.totatCostMainSum} shrink-0 `}>
                1 750 грн
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
