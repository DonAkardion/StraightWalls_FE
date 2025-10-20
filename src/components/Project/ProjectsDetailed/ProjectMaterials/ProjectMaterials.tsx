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
  base_purchase_price?: number;
  previous_remaining?: number;
  additional_delivery?: number;
  current_remaining?: number;
  delivery_quantity?: number;
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
  onConfirm?: () => void;
  area?: number;
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
  onConfirm,
  area,
}: Props) => {
  const [selection, setSelection] = useState<MaterialSelection[]>(() =>
    materials.map((m) => ({
      materialId: m.id,
      quantity: area ?? (hasQuantity(m) ? m.quantity : 0),
      base_purchase_price: m.base_purchase_price ?? 0,
      previous_remaining: hasQuantity(m) ? m.previous_remaining ?? 0 : 0,
      additional_delivery: hasQuantity(m) ? m.additional_delivery ?? 0 : 0,
      current_remaining: hasQuantity(m) ? m.current_remaining ?? 0 : 0,
      delivery_quantity: hasQuantity(m) ? m.delivery_quantity ?? 0 : 0,
    }))
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  const pathname = usePathname();
  const { user } = useUser();
  const role = user?.role;

  useEffect(() => {
    onSelectionChange?.(selection);
  }, [selection, onSelectionChange]);

  useEffect(() => {
    if (!materials.length) return;

    setSelection((prev) =>
      materials.map((m) => {
        const existing = prev.find((s) => s.materialId === m.id);
        return {
          materialId: m.id,
          quantity:
            existing?.quantity ??
            (hasQuantity(m) ? m.quantity ?? 0 : 0) ??
            area ??
            0,
          base_purchase_price:
            existing?.base_purchase_price ?? Number(m.base_purchase_price ?? 0),
          previous_remaining:
            existing?.previous_remaining ??
            (hasQuantity(m) ? m.previous_remaining ?? 0 : 0),
          additional_delivery:
            existing?.additional_delivery ??
            (hasQuantity(m) ? m.additional_delivery ?? 0 : 0),
          current_remaining:
            existing?.current_remaining ??
            (hasQuantity(m) ? m.current_remaining ?? 0 : 0),
          delivery_quantity:
            existing?.delivery_quantity ??
            (hasQuantity(m) ? m.delivery_quantity ?? 0 : 0),
        };
      })
    );
  }, [materials]);

  useEffect(() => {
    if (!area) return;

    setSelection((prev) =>
      prev.map((s) => ({
        ...s,
        quantity: area,
      }))
    );
  }, [area]);

  const effectiveMaterials = useMemo(() => {
    return materials;
  }, [materials]);

  const handleQuantityChange = (
    materialId: number,
    field: keyof MaterialWithQuantity,
    value: number
  ) => {
    const next = selection.map((sel) =>
      sel.materialId === materialId ? { ...sel, [field]: value } : sel
    );
    setSelection(next);
  };

  const handleConfirm = () => {
    const next = !isConfirmed;
    setIsConfirmed(next);
    if (next && onConfirm) onConfirm();
  };

  const total = useMemo(() => {
    if (!selection.length) return 0;
    return selection.reduce((sum, s) => {
      const qty = Number(s.quantity ?? area ?? 0);
      const price = Number(s.base_purchase_price ?? 0);
      return sum + price * qty;
    }, 0);
  }, [selection, area]);

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
        selection={selection}
        editable={!isConfirmed && editable}
        onQuantityChange={handleQuantityChange}
        className={tableClassName}
        confirmed={isConfirmed}
        area={area}
      />

      <div
        className={`${styles.tableBetweenWrapSecond} relative h-[60px] md:h-[48px] w-full z-[10]`}
      >
        <div
          className={`${styles.totatCostSeparate} md:absolute md:top-[20px] w-full mt-[15px] md:mt-0 z-[10] rounded-[5px]`}
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

          {pathname === `/${role}/addProject` && (
            <div className="w-full flex justify-center">
              <div
                className={`${styles.confirmButton} ${
                  isConfirmed ? styles.confirmed : ""
                } flex rounded-[5px] md:mt-[40px] md:mb-[40px] mb-[20px] mt-[20px] w-full max-w-[360px] h-[50px] items-center justify-center cursor-pointer`}
              >
                <button
                  onClick={handleConfirm}
                  className={`${styles.confirmBtn} w-full h-full flex items-center justify-center text-center`}
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
