"use client";

import React, { useMemo, useEffect } from "react";
import styles from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate.module.css";
import lockalStyles from "./MaterialIncomeEditor.module.css";
import { MaterialIncomeTable } from "./MaterialIncomeTable/MaterialIncomeTable";
import { ProjectMaterial, MaterialIncomeRow } from "@/types/projectComponents";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

interface Props {
  materials: ProjectMaterial[];
  tableClassName?: string;
  tablesTytle?: string;
}

export const MaterialIncomeEditor = ({
  materials,
  tableClassName,
  tablesTytle,
}: Props) => {
  const { setMaterialsIncomeTotal } = useProjectCreation();

  // формуємо дані для таблиці з урахуванням прибутку та суми
  const materialRows: MaterialIncomeRow[] = useMemo(
    () =>
      materials.map((m) => {
        const total = m.selling_price * m.quantity + m.delivery * m.quantity;
        const income = total - m.purchase_price * m.quantity;
        return {
          id: m.id,
          name: m.name,
          description: m.description,
          unit: m.unit,
          quantity: m.quantity,
          sum: total,
          income,
        };
      }),
    [materials]
  );

  // загальний заробіток
  const totalMaterilalsIncome = useMemo(
    () => materialRows.reduce((sum, m) => sum + m.income, 0),
    [materialRows]
  );

  // зберігаємо у контексті для подальшого використання
  useEffect(() => {
    setMaterialsIncomeTotal(totalMaterilalsIncome);
  }, [totalMaterilalsIncome, setMaterialsIncomeTotal]);

  return (
    <section className={`${styles.sectionMaterials} mb-[40px]  md:mt-[126px]`}>
      <h2
        className={`${lockalStyles.materialsIncomeTytle} mb-[10px] md:mb-[16px]`}
      >
        {tablesTytle}
      </h2>
      {materials.length > 0 && (
        <div>
          <MaterialIncomeTable
            materials={materialRows}
            className={tableClassName}
          />

          <div
            className={`${styles.tableBetweenWrap} relative h-[126px] md:h-[48px] w-full z-[10]`}
          >
            <div
              className={`${styles.totatCostSeparate} absolute top-[16%] md:top-[-14%] md:h-[142px] w-full z-[10] rounded-[5px]`}
            >
              <div
                className={`${styles.totatCostMain} flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full z-[11] rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]`}
              >
                <div className={`${styles.totatCostMainTytle}`}>
                  Загальний заробіток на матеріалах
                </div>
                <div className={`${styles.totatCostMainSum} shrink-0`}>
                  {totalMaterilalsIncome} грн
                </div>
              </div>
              {/* <h3
              className={`${styles.totatCostSeparateTytle} md:pl-[36px] md:pt-[26px] pt-[10px]`}
            >
              Додаткові роботи
            </h3> */}
            </div>
          </div>
        </div>
      )}
      {materials.length == 0 && (
        <div className={`${lockalStyles.messageText} ml-[20px]`}>
          Матеріали відсутні
        </div>
      )}
    </section>
  );
};
