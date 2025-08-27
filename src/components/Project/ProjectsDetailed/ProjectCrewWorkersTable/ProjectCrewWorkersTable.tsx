"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { Worker } from "@/types/worker";

interface ProjectCrewWorkersTableProps {
  workers: Worker[];
  enableTooltips?: boolean;
  expandedId?: number | null;
  onInspect?: (item: Worker) => void;
}

export function ProjectCrewWorkersTable({
  workers,
  enableTooltips = true,
  expandedId = null,
  onInspect,
}: ProjectCrewWorkersTableProps) {
  const crewWorkers = workers;

  return (
    <div className="mb-[40px]">
      <Table<Worker>
        data={crewWorkers}
        expandedId={expandedId}
        onInspect={onInspect}
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
        renderInspection={(worker) => (
          <Inspect<Worker>
            item={worker}
            getId={(item) => item.id}
            fields={[
              { label: "Посада", value: (item) => item.position },
              { label: "Контакти", value: (item) => item.phone_number },
            ]}
          />
        )}
      />
    </div>
  );
}
