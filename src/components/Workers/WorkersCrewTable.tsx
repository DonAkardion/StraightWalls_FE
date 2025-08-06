"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Crew } from "@/types/crew";

interface WorkersCrewTableProps {
  crews: Crew[];
  onDelete: (id: string) => void;
  onEdit: (updated: Crew) => void;
  onAdd: () => void;
  enableTooltips?: boolean;
}

export function WorkersCrewTable({
  crews,
  onDelete,
  onEdit,
  onAdd,
  enableTooltips = true,
}: WorkersCrewTableProps) {
  return (
    <Table
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
          key: "brigadier",
          label: "Кількість робітників",
          tooltip: (crew) => `Кількість робітників: ${crew.brigadier}`,
        },
        {
          key: "brigadier",
          label: "Бригадир",
          tooltip: (crew) => `Бригадир: ${crew.brigadier}`,
        },
        {
          key: "status",
          label: "Статус",
          tooltip: (crew) => `Статус: ${crew.status}`,
        },
      ]}
    />
  );
}
