"use client";

import React from "react";
import styles from "./InProgress.module.css";
import { InProgressTable } from "@/components/HomePage/InProgress/InProgressTable/InProgressTable";
import { mockMaterials } from "@/mock/InProgress/inProgressMock";

export const InProgress: React.FC = () => {
  return (
    <section className="w-full mb-[40px] md:mb-[60px]">
      <h2 className={`${styles.tytle} mb-[15px]`}>В роботі</h2>
      <InProgressTable data={mockMaterials} className="InProgressTableWrap" />
    </section>
  );
};
