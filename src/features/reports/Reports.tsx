"use client";
import React from "react";
import { ReportsContainer } from "./ReportsContainer";
import { DoughnutChart } from "@/components/Reports/DonutChart/DonutChart";
import { GraphicChart } from "@/components/Reports/GraphicChart/GraphicChart";
import { MaterialsTable } from "@/components/Reports/ReportsTable/ReportsTable"

export function Reports() {
  return (
    <ReportsContainer>
      <DoughnutChart />
      <MaterialsTable />
      <GraphicChart />
    </ReportsContainer>
  );
}
