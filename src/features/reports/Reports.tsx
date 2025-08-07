"use client";
import React from "react";
import styles from "./Reports.module.css";

export function Reports() {
  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[250px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[60px]`}
    >
      <div>ReportsPieChart</div>
      <div>ReportsMaterialsAmount</div>
      <div>ReportsLinechart</div>
    </section>
  );
}
