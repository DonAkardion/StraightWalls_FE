"use client";
import React from "react";
import { ReportsContainer } from "./ReportsContainer";
import { DoughnutChart } from "../../components/DonutChart/DonutChart";
import MaterialsTable from "../../components/ReportsTable/ReportsTable";
import { GraphicChart } from "../../components/GraphicChart/GraphicChart";



export function Reports() {
  return (
    <ReportsContainer>
      <DoughnutChart />
      <MaterialsTable />
      <GraphicChart />
    </ReportsContainer>
  );
}
