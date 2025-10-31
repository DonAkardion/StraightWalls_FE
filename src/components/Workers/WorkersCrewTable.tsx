"use client";

import React, { useState, useMemo } from "react";
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

  const crews = useMemo(() => {
    if (!initialCrews) return [];

    const extractNumber = (name: string): number | null => {
      const match = name.match(/№\s*(\d+)/i);
      return match ? parseInt(match[1], 10) : null;
    };

    const withNumbers = initialCrews
      .map((c) => ({ ...c, sortNum: extractNumber(c.name) }))
      .filter((c) => c.sortNum !== null)
      .sort((a, b) => (a.sortNum ?? 0) - (b.sortNum ?? 0));

    const withoutNumbers = initialCrews
      .map((c) => ({ ...c, sortNum: extractNumber(c.name) }))
      .filter((c) => c.sortNum === null);

    return [...withNumbers, ...withoutNumbers];
  }, [initialCrews]);

  const workers = initialWorkers || [];

  return (
    <div className="mb-[60px]">
      <Table<Crew>
        title={"Бригади"}
        data={crews}
        expandedId={expandedId}
        className="CrewsTableWrap"
        showIndex={true}
        onDelete={(item) => onDelete(item.id)}
        addLink="/admin/workers/addWorker"
        addLinkId={"123"}
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
              if (crew.projects && crew.projects.length > 0) {
                return <span>{crew.projects[0].name}</span>;
              }
              return (
                <div className="flex justify-center items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-green-600"></div>
                  <span>Вільні</span>
                </div>
              );
            },
            tooltip: (crew: Crew) => {
              if (crew.projects && crew.projects.length > 0) {
                return `Об'єкт: ${crew.projects[0].name}`;
              }
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
                label: "Проєкти",
                value: (crew: Crew) => {
                  if (crew.projects && crew.projects.length > 0) {
                    return (
                      <ul className=" pl-4">
                        {crew.projects.map((p) => (
                          <li key={p.id}>{p.name}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-600"></div>
                      <span>Вільні</span>
                    </div>
                  );
                },
              },
            ]}
          />
        )}
      />
    </div>
  );
}
