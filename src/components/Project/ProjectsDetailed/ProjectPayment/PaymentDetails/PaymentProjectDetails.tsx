"use client";
import React, { useState } from "react";
import styles from "@/components/Project/ProjectsDetailed/ProjectPayment/ProjectPayment.module.css";

interface PaymentDetailItem {
  label: string;
  value: string | number;
}
interface PaymentDetailsProps {
  title?: string;
  items: PaymentDetailItem[];
}

export function PaymentProjectDetails({ items, title }: PaymentDetailsProps) {
  return (
    <div className={`${styles.generalStatsDatailed}`}>
      <h2 className={`${styles.datailedTytle} mb-[16px]`}>{title}</h2>
      <div className={`${styles.datailedList} flex flex-col gap-[16px]`}>
        {items.map((item, idx) => (
          <div key={idx} className={`${styles.datailedListItem}`}>
            <span className={`${styles.datailedListItemText}`}>
              {item.label}
            </span>
            <span className={`${styles.datailedListItemSum}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
