"use client";
import React from "react";
import styles from "./stageCard.module.css";

interface StageCardProps {
  title: string;
  sum: string;
  description: string;
  status: string;
}
const statusColorMap: Record<string, string> = {
  Виконано: styles.statusDone,
  "В процесі": styles.statusInProgress,
  Очікує: styles.statusWaiting,
  "Не виконано": styles.statusCanceled,
};
export function StageCard({ title, sum, description, status }: StageCardProps) {
  const statusClass = statusColorMap[status] || "";
  return (
    <div className={`${styles.stageCard} max-w-[468px] mx-auto`}>
      <div
        className={`${styles.stageCardTytle} flex justify-between pt-[16px] pr-[12px] pb-[18px] pl-[22px]`}
      >
        <div className={styles.cardTytleName}>
          <span>{title}</span>
        </div>
        <div className={styles.cardTytleSum}>
          <span>{sum}</span>
        </div>
      </div>

      <div
        className={`${styles.stageCardBody} pt-[18px] pr-[8px] pb-[21px] pl-[16px]`}
      >
        <div className={`${styles.cardBodyDesc} pb-[22px]`}>
          <span>{description}</span>
        </div>
        <div className={`${styles.cardTytleStatus} flex justify-center`}>
          <div
            className={`${styles.statusIcon} rounded-full w-[24px] h-[24px] mr-[6px] ${statusClass}`}
          ></div>
          <div className={styles.statusText}>{status}</div>
        </div>
      </div>
    </div>
  );
}
