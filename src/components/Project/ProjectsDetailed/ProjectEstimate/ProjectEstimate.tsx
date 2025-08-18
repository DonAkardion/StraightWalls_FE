"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ProjectEstimate.module.css";
import { Service } from "@/types/service";
import { ProjectServicesTable } from "./ProjectEstimateTable/ProjectServicesTable";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

interface Props {
  services: Service[];
  editable?: boolean;
  onServicesChange?: (services: Service[]) => void;
  tableClassName?: string;
  tablesTytle?: string;
}

export const ProjectEstimate = ({
  services,
  editable = false,
  onServicesChange,
  tableClassName,
  tablesTytle,
}: Props) => {
  const [localServices, setLocalServices] = useState<Service[]>(services);
  const pathname = usePathname();
  const user = useUser();

  // Синхронізуємо, якщо зовнішні services зміняться
  useEffect(() => {
    setLocalServices(services);
  }, [services]);

  const handleAmountChange = (id: string, newAmount: number) => {
    setLocalServices((prev) => {
      const updated = prev.map((s) =>
        s.id === id ? { ...s, amount: newAmount } : s
      );
      if (onServicesChange) {
        onServicesChange(updated);
      }
      return updated;
    });
  };
  const mainServices = useMemo(
    () => localServices.filter((s) => s.serviceType === "Основні послуги"),
    [localServices]
  );
  const additionalServices = useMemo(
    () => localServices.filter((s) => s.serviceType === "Додаткові роботи"),
    [localServices]
  );

  const totalMain = useMemo(
    () => mainServices.reduce((sum, s) => sum + s.price * s.amount, 0),
    [mainServices]
  );
  const totalAdditional = useMemo(
    () => additionalServices.reduce((sum, s) => sum + s.price * s.amount, 0),
    [additionalServices]
  );

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  return (
    <section className={`${styles.sectionEstimate} mb-[40px] md:mb-[126px]`}>
      <h2 className={`${styles.estimateTytle} mb-[16px]`}>{tablesTytle}</h2>
      <div className="">
        <ProjectServicesTable
          services={localServices}
          type="Основні послуги"
          editable={editable}
          onAmountChange={handleAmountChange}
          className={tableClassName}
        />
        <div
          className={`${styles.tableBetweenWrap} relative h-[126px] md:h-[48px] w-full z-[10]`}
        >
          <div
            className={`${styles.totatCostSeparate} absolute top-[16%] md:top-[-16%] md:h-[142px] w-full z-[10] md:rounded-none rounded-[5px]`}
          >
            <div
              className={`${styles.totatCostMain} flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full z-[11] rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]  `}
            >
              <div className={`${styles.totatCostMainTytle} `}>
                Загальна вартість робіт (стандартна штукатурка){" "}
              </div>
              <div className={`${styles.totatCostMainSum} shrink-0 `}>
                {formatNumber(totalMain)} грн
              </div>
            </div>
            {pathname === `/${user.role}/addProject` && (
              <div className="w-full flex justify-center">
                <div
                  className={`${styles.confirmButton} rounded-[5px] mt-[20px] mb-[10px] w-full max-w-[360px] h-[50px] items-center justify-center cursor-pointer`}
                >
                  <button className="w-full h-full flex items-center justify-center text-center">
                    Підтвердити
                  </button>
                </div>
              </div>
            )}

            <h3
              className={`${styles.totatCostSeparateTytle} md:pl-[36px] md:pt-[26px] pt-[10px]`}
            >
              Додаткові роботи
            </h3>
          </div>
          {/* <div
            className={` absolute top-[-30px] right-[34%] w-[120px] h-[120px] bg-amber-700 z-10`}
          ></div> */}
        </div>
        {pathname === `/${user.role}/addProject` && (
          <div className="md:hidden h-[76px] "></div>
        )}
        <ProjectServicesTable
          services={localServices}
          type="Додаткові роботи"
          editable={editable}
          onAmountChange={handleAmountChange}
          className={tableClassName}
        />
        <div
          className={`${styles.tableBetweenWrapSecond} relative h-[60px] md:h-[48px] w-full z-[10]`}
        >
          <div
            className={`${styles.totatCostSeparate} md:absolute md:bottom-[-20px] w-full mt-[15px] md:mt-0 z-[10]  rounded-[5px]  `}
          >
            <div
              className={`${styles.totatCostMain} ${styles.totatCostMainSwadow} flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]  `}
            >
              <div className={`${styles.totatCostMainTytle} `}>
                Загальна вартість додаткових робіт
              </div>
              <div className={`${styles.totatCostMainSum} shrink-0 `}>
                {formatNumber(totalAdditional)} грн
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
