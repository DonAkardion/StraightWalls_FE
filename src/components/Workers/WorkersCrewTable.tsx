"use client";

import React, { useState } from "react";
import { Table } from "@/components/Table/Table";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { useCrew } from "@/features/addWorker/addWorkerContext";
import { Inspect } from "@/components/Table/Inspect/Inspect";

interface WorkersCrewTableProps {
  crews: Crew[];
  workers: Worker[];
  onDelete: (id: string) => void;
  onEdit: (updated: Crew) => void;
  onAdd: () => void;
  enableTooltips?: boolean;
}

export function WorkersCrewTable({
  crews: initialCrews,
  workers: initialWorkers,
  onDelete,
  onEdit,
  onAdd,
  enableTooltips = true,
}: WorkersCrewTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ctx = useCrew();

  const crews = initialCrews.concat(
    ctx?.crews.filter((c) => !initialCrews.find((ic) => ic.id === c.id)) || []
  );
  const workers = initialWorkers;

  return (
    <div className="mb-[60px]">
      <Table<Crew>
        title={"Бригади"}
        data={crews}
        expandedId={expandedId}
        className="CrewsTableWrap"
        showIndex={true}
        onDelete={(item) => onDelete(item.id)}
        onEdit={onEdit}
        onAdd={onAdd}
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        addLink="/admin/workers/addWorker"
        addLinkId="123"
        enableTooltips={enableTooltips}
        addButtonText="Додати бригаду"
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
          },
          {
            key: "brigadier",
            label: "Бригадир",
            render: (crew: Crew) =>
              typeof crew.brigadier === "object"
                ? `${crew.brigadier?.name}`
                : "",
            tooltip: (crew) =>
              typeof crew.brigadier === "object"
                ? `Бригадир: ${crew.brigadier?.name}`
                : `Бригадир:`,
          },
          {
            key: "status",
            label: "Статус",
            render: (crew: Crew) => {
              if (!crew.status) {
                return (
                  <div className="flex justify-center items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-600"></div>
                    <span>Вільні</span>
                  </div>
                );
              }
              return <span>{crew.status}</span>;
            },
          },
        ]}
        renderInspection={(crew) => (
          <Inspect<Crew>
            item={crew}
            getId={(item) => item.id}
            fields={[
              {
                label: "Кількість робітників",
                value: (crew: Crew) =>
                  workers.filter((worker) => worker.crewId === crew.id).length,
              },
              {
                label: "Бригадир",
                value: (crew: Crew) =>
                  typeof crew.brigadier === "object"
                    ? `${crew.brigadier?.name}`
                    : "",
              },
              {
                label: "Статус",
                value: (crew: Crew) => {
                  if (!crew.status) {
                    return (
                      <div className="flex justify-center items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-600"></div>
                        <span>Вільні</span>
                      </div>
                    );
                  }
                  return <span>{crew.status}</span>;
                },
              },
            ]}
          />
        )}
      />
    </div>
  );
}
