"use client";

import React, { useState } from "react";
import { Table } from "@/components/Table/Table";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { Inspect } from "@/components/Table/Inspect/Inspect";

interface WorkersTableProps {
  workers: Worker[];
  crews: Crew[];
  onDelete: (id: number) => void;
  onEdit: (updated: Worker) => void;
  onAdd: () => void;
  enableTooltips?: boolean;
}

export function WorkersTable({
  workers,
  onDelete,
  onEdit,
  onAdd,
  enableTooltips = true,
}: WorkersTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  return (
    <div className="mb-[60px]">
      <Table<Worker>
        title={"Робітники"}
        data={workers}
        expandedId={expandedId}
        className="WorkersTableWrap"
        showIndex={true}
        onDelete={(item) => onDelete(item.id)}
        onEdit={onEdit}
        onAdd={onAdd}
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        enableTooltips={enableTooltips}
        addButtonText="Додати робітника"
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
          },
          {
            key: "phone",
            label: "Контакти",
            tooltip: (worker) => `Контакти: ${worker.phone}`,
          },
        ]}
        renderInspection={(worker) => (
          <Inspect<Worker>
            item={worker}
            getId={(item) => item.id}
            fields={[
              {
                label: "Посада",
                value: (item) => item.occupation,
              },
              {
                label: "Зарплата",
                value: (item) => item.salary,
              },
              {
                label: "Контакти",
                value: (item) => item.phone ?? "—",
              },
            ]}
          />
        )}
      />
    </div>
  );
}
