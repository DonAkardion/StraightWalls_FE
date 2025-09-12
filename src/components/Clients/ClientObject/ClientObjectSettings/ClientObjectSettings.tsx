"use client";

import React from "react";
import styles from "./ClientObjectSettings.module.css";
import { useUser } from "@/context/UserContextProvider";
import { ClientObject } from "@/types/client";
import { SettingsTable } from "@/components/Clients/ClientObject/ClientObjectSettings/SettingsTable";

interface Props {
  objectId: number;
}

export function ClientObjectSettings({ objectId }: Props) {
  const columns = [
    "Гардероб",
    "Кухня",
    "Спальня",
    "Спальня2",
    "Гардероб",
    "Балкон",
    "Котельня",
    "Кори",
    "Санвузл",
    "Санвузл2",
    "Стелі",
  ];
  return (
    <section
      className={`${styles.objectTableSection} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div className={`${styles.objectTableTitle} mb-[16px]`}>Параметри</div>
      <div className={`${styles.objectTableContainer}`}>
        <div className={`${styles.containerItem}`}>
          <div className={`${styles.containerItemTitle} mb-[16px] ml-[8px]`}>
            Загальна таблиця
          </div>
          <SettingsTable columns={columns} />
          <div className={`${styles.containerItemTitle} mb-[16px] ml-[8px]`}>
            Метри Погонні Відкосів
          </div>
          <SettingsTable columns={columns} />
          <div className={`${styles.containerItemTitle} mb-[16px] ml-[8px]`}>
            Метри Погонні
          </div>
          <SettingsTable columns={columns} />
        </div>
      </div>
    </section>
  );
}
