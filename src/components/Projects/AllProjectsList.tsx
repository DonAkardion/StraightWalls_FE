"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { Crew } from "@/types/crew";
import { Client } from "@/types/client";

interface Props {
  projects: Project[];
  clients: Client[];
  crews: Crew[];
  onDelete: (id: string) => void;
  onEdit: (updated: Project) => void;
  onAdd: () => void;
  role?: string;
  enableTooltips?: boolean;
}

export const AllProjectsList = ({
  projects,
  clients,
  crews,
  onDelete,
  onEdit,
  role,
  enableTooltips = true,
}: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  const handleRowClick = (id: string) => {
    if (!role) return;
    router.push(`/${role}/projects/projectDetailed/${id}`);
  };

  const getClientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.name ?? "Відсутній Клієнт";

  const getCrewName = (crewId: string) =>
    crews.find((c) => c.id === crewId)?.name ?? "Відсутня бригада";

  return (
    <Table<Project>
      data={projects}
      expandedId={expandedId}
      className="projectsTableWrap"
      onEdit={role === "admin" ? onEdit : undefined}
      onDelete={role === "admin" ? (item) => onDelete(item.id) : undefined}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      onRowClick={handleRowClick}
      enableTooltips={enableTooltips}
      columns={[
        {
          key: "name",
          label: "Назва",
          tooltip: (project) => `Проєкт: ${project.name}`,
        },
        {
          key: "clientId",
          label: "Клієнт",
          render: (project) => getClientName(project.clientId),
          tooltip: (project) => `Клієнт: ${getClientName(project.clientId)}`,
        },
        {
          key: "budget",
          label: "Вартість",
        },
        {
          key: "crewId",
          label: "Бригада",
          render: (project) => getCrewName(project.crewId),
          tooltip: (project) => `Бригада: ${getCrewName(project.crewId)}`,
        },
        {
          key: "startDate",
          label: "Початок",
          tooltip: (project) => `Початок: ${project.startDate}`,
        },
      ]}
      renderInspection={(project) => (
        <Inspect<Project>
          item={project}
          getId={(item) => item.id}
          onEdit={role === "admin" ? onEdit : undefined}
          onDelete={role === "admin" ? onDelete : undefined}
          fields={[
            {
              label: "Клієнт",
              value: (item) => getClientName(item.clientId),
            },
            {
              label: "Бригада",
              value: (item) => getCrewName(item.crewId),
            },
            {
              label: "Початок",
              value: (item) => item.startDate,
            },
            {
              label: "Завершення",
              value: (item) => item.endDate,
            },
            {
              label: "Статус",
              value: (item) => item.status ?? "—",
            },
          ]}
        />
      )}
    />
  );
};
