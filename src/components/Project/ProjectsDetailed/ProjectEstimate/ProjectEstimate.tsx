"use client";
import React from "react";
import styles from "./ProjectEstimate.module.css";
import { Service } from "@/types/service";
import { ProjectServicesTable } from "./ProjectEstimateTable/ProjectServicesTable";

interface Props {
  services: Service[];
}

export const ProjectEstimate = ({ services }: Props) => {
  return (
    <section className={`${styles.sectionEstimate} mb-[40px] md:mb-[126px]`}>
      <h2 className={`${styles.estimateTytle} mb-[16px]`}>Кошторис</h2>
      <div className="relative">
        <ProjectServicesTable services={services} type="Основні послуги" />
        <div
          className={`${styles.tableetweenWrap} h-[148px] md:h-[48px] w-full z-[-10]`}
        ></div>
        <div
          className={`${styles.totatCostSeparate} absolute top-[42%] md:top-[50%] md:h-[142px] w-full z-[10] rounded-[5px]`}
        >
          <div
            className={`${styles.totatCostMain} flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full z-[11] rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]  `}
          >
            <div className={`${styles.totatCostMainTytle} `}>
              Загальна вартість робіт (стандартна штукатурка){" "}
            </div>
            <div className={`${styles.totatCostMainSum} shrink-0 `}>
              {" "}
              39 317,5 грн{" "}
            </div>
          </div>
          <h3
            className={`${styles.totatCostSeparateTytle} md:pl-[36px] md:pt-[18px] pt-[40px]`}
          >
            Додаткові роботи
          </h3>
        </div>
        <ProjectServicesTable services={services} type="Додаткові роботи" />
        <div
          className={`${styles.totatCostSeparate} md:absolute md:bottom-[-64px] w-full mt-[15px] md:mt-0 z-[10] rounded-[5px] `}
        >
          <div
            className={`${styles.totatCostMain}  flex justify-between items-center gap-2 h-[60px] md:h-[74px] w-full rounded-[5px] py-[13px] px-[15px] md:py-[18px] md:pl-[24px] md:pr-[40px]  `}
          >
            <div className={`${styles.totatCostMainTytle} `}>
              Загальна вартість додаткових робіт
            </div>
            <div className={`${styles.totatCostMainSum} shrink-0 `}>
              1 750 грн
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
