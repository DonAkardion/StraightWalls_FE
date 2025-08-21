"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Worker } from "@/types/worker";
import { Crew } from "@/types/crew";

interface ProjectCrewWorkersTableProps {
  workers: Worker[];
  crewId: number;
  crews: Crew[];
  enableTooltips?: boolean;
}

export function ProjectCrewWorkersTable({
  workers,
  crewId,
  enableTooltips = true,
}: ProjectCrewWorkersTableProps) {
  const crewWorkers = workers.filter((worker) => worker.crewId === crewId);

  return (
    <div className="mb-[40px]">
      <Table
        data={crewWorkers}
        className="ProjectCrewWorkersTableWrap"
        showIndex={true}
        enableTooltips={enableTooltips}
        columns={[
          {
            key: "name",
            label: "ПІБ виконавця",
            tooltip: (worker) => `ПІБ виконавця: ${worker.name}`,
          },
          {
            key: "occupation",
            label: "Посада",
          },
          {
            key: "salary",
            label: "Зарплата",
          },
          {
            key: "phone",
            label: "Контакти",
            tooltip: (worker) => `Контакти: ${worker.phone}`,
          },
        ]}
      />
    </div>
  );
}
