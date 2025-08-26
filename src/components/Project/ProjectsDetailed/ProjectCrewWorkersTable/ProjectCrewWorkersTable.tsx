"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Worker } from "@/types/worker";

interface ProjectCrewWorkersTableProps {
  workers: Worker[];
  enableTooltips?: boolean;
}

export function ProjectCrewWorkersTable({
  workers,
  enableTooltips = true,
}: ProjectCrewWorkersTableProps) {
  const crewWorkers = workers;

  return (
    <div className="mb-[40px]">
      <Table<Worker>
        data={crewWorkers}
        className="ProjectCrewWorkersTableWrap"
        showIndex={true}
        enableTooltips={enableTooltips}
        columns={[
          {
            key: "full_name",
            label: "ПІБ виконавця",
            tooltip: (worker) => `ПІБ виконавця: ${worker.full_name}`,
          },
          {
            key: "position",
            label: "Посада",
          },
          {
            key: "phone_number",
            label: "Контакти",
            tooltip: (worker) => `Контакти: ${worker.phone_number}`,
          },
        ]}
      />
    </div>
  );
}
