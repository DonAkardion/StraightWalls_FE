"use client";

import React from "react";
import styles from "./InProgress.module.css";
import { InProgressTable } from "@/components/HomePage/InProgress/InProgressTable/InProgressTable";
import { ProjectReportResponse } from "@/types/project";

interface Props {
  reports: ProjectReportResponse[];
}

export const InProgress: React.FC<Props> = ({ reports }) => {
  return (
    <section className="w-full mb-[40px] md:mb-[60px]">
      <h2 className={`${styles.tytle} mb-[15px]`}>В роботі</h2>
      <InProgressTable reports={reports} className="InProgressTableWrap" />
    </section>
  );
};
