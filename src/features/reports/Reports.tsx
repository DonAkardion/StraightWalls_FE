"use client";

import React, { useEffect, useState } from "react";
import { ReportsContainer } from "./ReportsContainer";
import { DoughnutChart } from "@/components/Reports/DonutChart/DonutChart";
import { GraphicChart } from "@/components/Reports/GraphicChart/GraphicChart";
// import { MaterialsList } from "@/components/Settings/MaterialSettings/MaterialList";
import { Material } from "@/types/material";
import { getProjects } from "@/api/projects";
import { getMaterials } from "@/api/material";
import { useUser } from "@/context/UserContextProvider";

export function Reports() {
  const { token } = useUser();
  const [projects, setProjects] = useState<{ id: number }[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [allProjects, allMaterials] = await Promise.all([
          getProjects(token),
          getMaterials(token),
        ]);

        setProjects(allProjects || []);
        setMaterials(allMaterials || []);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Завантаження...</div>;
  }

  return (
    <ReportsContainer>
      <DoughnutChart />
      {/* <MaterialsList materials={materials} /> */}
      <GraphicChart projects={projects} />
    </ReportsContainer>
  );
}
