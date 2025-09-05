"use client";

import React, { useEffect, useState } from "react";
import { ReportsContainer } from "./ReportsContainer";
import { DoughnutChart } from "@/components/Reports/DonutChart/DonutChart";
import { GraphicChart } from "@/components/Reports/GraphicChart/GraphicChart";
import { MaterialsTable } from "@/components/Reports/ReportsTable/ReportsTable";
import { getProjects } from "@/api/projects";
import { useUser } from "@/context/UserContextProvider";

export function Reports() {
  const { token } = useUser();
  const [projects, setProjects] = useState<{ id: number }[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects(token);
        setProjects(allProjects.map((p) => ({ id: p.id })));
      } catch (error) {
        console.error("Помилка завантаження проектів:", error);
      }
    };

    fetchProjects();
  }, [token]);

  return (
    <ReportsContainer>
      <DoughnutChart />
      <MaterialsTable />
      <GraphicChart projects={projects} />
    </ReportsContainer>
  );
}
