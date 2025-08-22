"use client";

import React, { useState } from "react";
import { Table } from "@/components/Table/Table";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { useCrew } from "@/features/addWorker/addWorkerContext";

interface WorkersCrewTableProps {
  crews: Crew[];
  workers: Worker[];
  onDelete: (id: number) => void;
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
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const ctx = useCrew();

  const crews =
    initialCrews.concat(
      ctx?.crews.filter((c) => !initialCrews.find((ic) => ic.id === c.id)) ||
        []
    ) || [];
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
            label: "Кількість робітників",
            render: (crew: Crew) =>
              workers.filter((worker) => worker.team_id === crew.id).length,
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
                  workers.filter((worker) => worker.team_id === crew.id).length,
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
