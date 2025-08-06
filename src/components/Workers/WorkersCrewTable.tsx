"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";

interface WorkersCrewTableProps {
  crews: Crew[];
  workers: Worker[];
  onDelete: (id: string) => void;
  onEdit: (updated: Crew) => void;
  onAdd: () => void;
  enableTooltips?: boolean;
}

export function WorkersCrewTable({
  crews,
  workers,
  onDelete,
  onEdit,
  onAdd,
  enableTooltips = true,
}: WorkersCrewTableProps) {
  return (
    <div className="mb-[60px]">
      <Table
        title={"Бригади"}
        data={crews}
        className="CrewsTableWrap"
        showIndex={true}
        onDelete={(item) => onDelete(item.id)}
        onEdit={onEdit}
        onAdd={onAdd}
        enableTooltips={enableTooltips}
        columns={[
          {
            key: "name",
            label: "Назва",
            tooltip: (crew) => `Назва бригади: ${crew.name}`,
          },
          {
            key: "workersCount",
            render: (crew: Crew) =>
              workers.filter((worker) => worker.crewId === crew.id).length,
            label: "Кількість робітників",
            tooltip: (crew) =>
              `Кількість робітників: ${
                workers.filter((w) => w.crewId === crew.id).length
              }`,
          },
          {
            key: "brigadier",
            label: "Бригадир",
            render: (crew: Crew) =>
              typeof crew.brigadier === "object"
                ? `${crew.brigadier?.name}`
                : "",
            tooltip: (crew: Crew) =>
              typeof crew.brigadier === "object"
                ? `Бригадир: ${crew.brigadier?.name}`
                : `Бригадир: ${""}`,
          },
          {
            key: "status",
            label: "Статус",
            tooltip: (crew) => `Статус: ${crew.status}`,
          },
        ]}
      />
    </div>
  );
}
