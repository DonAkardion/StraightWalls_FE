"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ProjectMaterials.module.css";
import { ProjectMaterialsTable } from "./ProjectMaterialsTable/ProjectMaterialsTable";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContextProvider";
import { Material } from "@/types/material";
import { MaterialWithQuantity } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

export interface MaterialSelection {
  materialId: number;
  quantity: number;
}
export interface MaterialRow extends Material {
  quantity: number;
  sum: number;
}

interface Props {
  materials: (Material | MaterialWithQuantity)[];
  editable?: boolean;
  onSelectionChange?: (selection: MaterialSelection[]) => void;
  tableClassName?: string;
  tablesTitle?: string;
}
const hasQuantity = (
  s: Material | MaterialWithQuantity
): s is MaterialWithQuantity =>
  "quantity" in s && typeof s.quantity === "number";

export const ProjectMaterials = ({
  materials,
  editable = false,
  onSelectionChange,
  tableClassName,
  tablesTitle,
}: Props) => {
  const [selection, setSelection] = useState<MaterialSelection[]>(() =>
    materials.map((m) => ({
      materialId: m.id,
      quantity: hasQuantity(m) ? m.quantity : 0,
    }))
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  const pathname = usePathname();
  const { user } = useUser();
  const role = user?.role;

  // Синхронізація selection при зміні списку матеріалів
  useEffect(() => {
    setSelection(
      materials.map((m) => ({
        materialId: m.id,
        quantity: hasQuantity(m) ? m.quantity : 0,
      }))
    );
  }, [materials]);

  // На Confirm-сторінці показуємо тільки ті, де quantity > 0
  const effectiveMaterials = useMemo(() => {
    if (editable) return materials; // перша сторінка — показуємо весь список
    // фінальна сторінка — тільки вибрані (quantity > 0)
    return materials.filter((m) => hasQuantity(m) && m.quantity > 0);
  }, [materials, editable]);

  const materialRows: MaterialRow[] = useMemo(() => {
    return effectiveMaterials.map((m) => {
      const quantity =
        selection.find((sel) => sel.materialId === m.id)?.quantity ?? 0;

      const baseSelling = Number((m as any).base_selling_price) || 0;
      const baseDelivery = Number((m as any).base_delivery) || 0;
      const sum = (baseSelling + baseDelivery) * quantity;

      return { ...(m as Material), quantity, sum };
    });
  }, [effectiveMaterials, selection]);

  const handleQuantityChange = (materialId: number, newQuantity: number) => {
    // рахуємо наступний масив selection
    const next = selection.map((sel) =>
      sel.materialId === materialId ? { ...sel, quantity: newQuantity } : sel
    );
    setSelection(next);

    if (onSelectionChange) {
      // віддаємо тільки елементи з quantity > 0
      onSelectionChange(next);
    }
  };

  const handleConfirm = () => {
    const next = !isConfirmed;
    setIsConfirmed(next);
    // дублюємо фільтрацію при підтвердженні
    if (next && onSelectionChange) {
      onSelectionChange(selection);
    }
  };

  const getQuantity = (material: Material | MaterialWithQuantity) => {
    if (editable) {
      return (
        selection.find((sel) => sel.materialId === material.id)?.quantity ?? 0
      );
    }
    return hasQuantity(material) ? material.quantity : 0;
  };

  const calculateMaterialSum = (
    m: Material | MaterialWithQuantity,
    qty: number
  ): number => {
    const baseSelling = Number((m as any).base_selling_price) || 0;
    const baseDelivery = Number((m as any).base_delivery) || 0;
    return (baseSelling + baseDelivery) * qty;
  };

  const total = useMemo(
    () =>
      effectiveMaterials.reduce(
        (sum, m) => sum + calculateMaterialSum(m, getQuantity(m)),
        0
      ),
    [effectiveMaterials, selection, editable]
  );
  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  return (
    <section className={`${styles.sectionEstimate} mb-[90px] md:mb-[66px]`}>
      <h2
        className={`${styles.estimateTytle} mb-[26px] sm:mb-[10px] md:mb-[16px]`}
      >
        {tablesTitle}
      </h2>

      <ProjectMaterialsTable
        materials={effectiveMaterials}
        selection={effectiveMaterials.map((m) => ({
          materialId: m.id,
          quantity: getQuantity(m),
        }))}
        editable={!isConfirmed && editable}
        onQuantityChange={handleQuantityChange}
        className={tableClassName}
        confirmed={isConfirmed}
      />

      <div
        className={`${styles.tableBetweenWrapSecond} relative h-[60px] md:h-[48px] w-full z-[10]`}
      >
        <div
          className={`${styles.totatCostSeparate} md:absolute md:top-[-6px] w-full mt-[15px] md:mt-0 z-[10] rounded-[5px]`}
        >
          <div
            className={`${styles.totatCostMain} ${styles.totatCostMainSwadow} flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]`}
          >
            <div className={`${styles.totatCostMainTytle}`}>
              Загальна вартість матеріалів
            </div>
            <div className={`${styles.totatCostMainSum} shrink-0`}>
              {formatNumber(total)} грн
            </div>
          </div>

          {pathname === `/${role}/addProject/addProjectMaterials` && (
            <div className="w-full flex justify-center">
              <div
                className={`${styles.confirmButton} ${
                  isConfirmed ? styles.confirmed : ""
                } flex rounded-[5px] md:mt-[40px] md:mb-[40px] mb-[20px] mt-[20px] w-full max-w-[360px] h-[50px] items-center justify-center cursor-pointer`}
              >
                <button
                  onClick={handleConfirm}
                  className="w-full h-full flex items-center justify-center text-center"
                >
                  {isConfirmed ? "Редагувати" : "Підтвердити"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
