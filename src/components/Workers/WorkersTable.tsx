"use client";

import React, { useState } from "react";
import { mockWorkers } from "@/mock/Workers/workersMock";
import { mockCrews } from "@/mock/Crew/crewMock";
import { Table } from "@/components/Table/Table";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";

interface WorkersTableProps {
  workers: Worker[];
  crews: Crew[];
  onDelete: (id: string) => void;
  onEdit: (updated: Worker) => void;
  onAdd: () => void;
  enableTooltips?: boolean;
}

export function WorkersTable({
  workers,
  crews,
  onDelete,
  onEdit,
  onAdd,
  enableTooltips = true,
}: WorkersTableProps) {
  return (
    <div className="mb-[60px]">
      <Table
        title={"Робітники"}
        data={workers}
        className="WorkersTableWrap"
        showIndex={true}
        onDelete={(item) => onDelete(item.id)}
        onEdit={onEdit}
        onAdd={onAdd}
        enableTooltips={enableTooltips}
        columns={[
          {
            key: "name",
            label: "ПІБ виконавця",
            tooltip: (worker) => `Назва бригади: ${worker.name}`,
          },
          {
            key: "occupation",
            label: "Посада",
            tooltip: (worker) => `Посада: ${worker.occupation}`,
          },
          {
            key: "salary",
            label: "Зарплата",
            tooltip: (worker) => `Зарплата: ${worker.salary}`,
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
