"use client";
import React from "react";
import { DoughnutChart } from "@/components/DonutChart/DonutChart";
import { GraphicChart } from "@/components/GraphicChart/GraphicChart";
import MaterialsTable from "@/components/ReportsTable/ReportsTable";
import { ReportsContainer } from './ReportsContainer';


export function Reports() {
  return (
    <ReportsContainer>
      <DoughnutChart />
      <MaterialsTable />
      <GraphicChart />
    </ReportsContainer>
  );
}
