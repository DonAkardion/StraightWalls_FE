"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ProjectEstimate.module.css";
import { Service } from "@/types/service";
import { ProjectServicesTable } from "./ProjectEstimateTable/ProjectServicesTable";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContextProvider";
import { ServiceWithQuantity } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

interface ServiceSelection {
  serviceId: number;
  quantity: number;
}

interface Props {
  services: (Service | ServiceWithQuantity)[];
  editable?: boolean;
  onSelectionChange?: (selection: ServiceSelection[]) => void;
  tableClassName?: string;
  tablesTitle?: string;
}

const hasQuantity = (
  s: Service | ServiceWithQuantity
): s is ServiceWithQuantity =>
  "quantity" in s && typeof s.quantity === "number";

export const ProjectEstimate = ({
  services,
  editable = false,
  onSelectionChange,
  tableClassName,
  tablesTitle,
}: Props) => {
  // Локальний стан кількостей (editable=true)
  const [selection, setSelection] = useState<ServiceSelection[]>(() =>
    services.map((s) => ({
      serviceId: s.id,
      quantity: hasQuantity(s) ? s.quantity : 0,
    }))
  );

  const [isConfirmed, setIsConfirmed] = useState(false);

  const pathname = usePathname();
  const { user } = useUser();
  const role = user?.role;

  // Синхронізація selection при зміні списку послуг
  useEffect(() => {
    setSelection(
      services.map((s) => ({
        serviceId: s.id,
        quantity: hasQuantity(s) ? s.quantity : 0,
      }))
    );
  }, [services]);

  // На Confirm-сторінці показуємо тільки ті, де quantity > 0
  const effectiveServices = useMemo(() => {
    if (editable) return services; // перша сторінка — показуємо весь список
    // фінальна сторінка — тільки вибрані (quantity > 0)
    return services.filter((s) => hasQuantity(s) && s.quantity > 0);
  }, [services, editable]);

  const handleQuantityChange = (serviceId: number, newQuantity: number) => {
    // рахуємо наступний масив selection
    const next = selection.map((sel) =>
      sel.serviceId === serviceId ? { ...sel, quantity: newQuantity } : sel
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

  const mainServices = useMemo(
    () => effectiveServices.filter((s) => s.service_type === "main"),
    [effectiveServices]
  );
  const additionalServices = useMemo(
    () => effectiveServices.filter((s) => s.service_type === "additional"),
    [effectiveServices]
  );

  const getQuantity = (service: Service | ServiceWithQuantity) => {
    if (editable) {
      return (
        selection.find((sel) => sel.serviceId === service.id)?.quantity ?? 0
      );
    }
    return hasQuantity(service) ? service.quantity : 0;
  };

  const totalMain = useMemo(
    () => mainServices.reduce((sum, s) => sum + s.price * getQuantity(s), 0),
    // коли editable=true, кількості беруться з selection, тож додаємо його в залежності
    [mainServices, selection, editable]
  );

  const totalAdditional = useMemo(
    () =>
      additionalServices.reduce((sum, s) => sum + s.price * getQuantity(s), 0),
    [additionalServices, selection, editable]
  );

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  return (
    <section className={`${styles.sectionEstimate} mb-[90px] md:mb-[156px]`}>
      <h2
        className={`${styles.estimateTytle} mb-[26px] sm:mb-[10px] md:mb-[16px]`}
      >
        {tablesTitle}
      </h2>
      {(editable || mainServices.length > 0) && (
        <>
          <ProjectServicesTable
            services={mainServices}
            selection={mainServices.map((s) => ({
              serviceId: s.id,
              quantity: getQuantity(s),
            }))}
            editable={!isConfirmed && editable}
            onQuantityChange={handleQuantityChange}
            className={tableClassName}
            confirmed={isConfirmed}
          />

          <div
            className={`${styles.tableBetweenWrap} relative h-[126px] md:h-[48px] w-full z-[10]`}
          >
            <div
              className={`${styles.totatCostSeparate} absolute top-[16%] md:top-[-16%] md:h-[132px] w-full z-[10] md:rounded-none rounded-[5px]`}
            >
              <div
                className={`${styles.totatCostMain} flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full z-[11] rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]`}
              >
                <div className={`${styles.totatCostMainTytle}`}>
                  Загальна вартість робіт (стандартна штукатурка)
                </div>
                <div className={`${styles.totatCostMainSum} shrink-0`}>
                  {formatNumber(totalMain)} грн
                </div>
              </div>

              {(editable || additionalServices.length > 0) && (
                <h3
                  className={`${styles.totatCostSeparateTytle} md:pl-[36px] md:pt-[26px] pt-[10px]`}
                >
                  Додаткові роботи
                </h3>
              )}
            </div>
          </div>
        </>
      )}
      {(editable || additionalServices.length > 0) && (
        <>
          <ProjectServicesTable
            services={additionalServices}
            selection={additionalServices.map((s) => ({
              serviceId: s.id,
              quantity: getQuantity(s),
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
                  Загальна вартість додаткових робіт
                </div>
                <div className={`${styles.totatCostMainSum} shrink-0`}>
                  {formatNumber(totalAdditional)} грн
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
                      className="w-full h-full flex items-center justify-center text-center"
                    >
                      {isConfirmed ? "Редагувати" : "Підтвердити"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};
