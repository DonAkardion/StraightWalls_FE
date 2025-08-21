"use client";
import React, { useState } from "react";
import styles from "./AllProjectsList.module.css";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { Crew } from "@/types/crew";
import { Client } from "@/types/client";
import tableStyles from "@/components/Table/Table.module.css";

interface Props {
  projects: Project[];
  clients: Client[];
  crews: Crew[];
  onDelete: (id: number) => void;
  onEdit: (updated: Project) => void;
  onAdd: () => void;
  role?: string;
  enableTooltips?: boolean;
  tablesTytle?: string;
}

export const AllProjectsList = ({
  projects,
  // clients,
  crews,
  onDelete,
  onEdit,
  role,
  enableTooltips = true,
  tablesTytle,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const router = useRouter();

  const handleRowClick = (id: number) => {
    if (!role) return;
    router.push(`/${role}/projects/projectsDetailed/${id}`);
  };

  // const getClientName = (clientId: number) =>
  //   clients.find((c) => c.id === clientId)?.full_name ?? "Відсутній Клієнт";

  const getCrewName = (crewId: number) =>
    crews.find((c) => c.id === crewId)?.name ?? "Відсутня бригада";

  const getRowClassName = (project: Project) => {
    switch (project.status) {
      case "Done":
        return tableStyles.completedRow;
      case "Waiting":
        return tableStyles.waitingRow;
      case "In progress":
        return tableStyles.inprogressRow;
      case "Canceled":
        return tableStyles.canceledRow;
      default:
        return "";
    }
  };

  return (
    <div className="mb-[60px] relative">
      <h2 className={`${styles.projectsTytle} mb-[10px] md:mb-[16px]`}>
        {tablesTytle}
      </h2>
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
        getRowClassName={getRowClassName}
        columns={[
          {
            key: "name",
            label: "Назва",
            tooltip: (project) => `Проєкт: ${project.name}`,
          },
          {
            key: "clientId",
            label: "Клієнт",
            // render: (project) => getClientName(project.clientId),
            // tooltip: (project) => `Клієнт: ${getClientName(project.clientId)}`,
          },
          {
            key: "budget",
            label: "Вартість",
            render: () => "12000", //замінити на реальну ціну
          },
          {
            key: "crewId",
            label: "Бригада",
            render: (project) => getCrewName(project.crewId),
            tooltip: (project) => `Бригада: ${getCrewName(project.crewId)}`,
          },
          {
            key: "dateRange",
            label: "Термін",
            render: (project) => `${project.startDate}/${project.endDate}`,
            tooltip: (project) =>
              `Термін: ${project.startDate} / ${project.endDate}`,
          },
        ]}
        renderInspection={(project) => (
          <Inspect<Project>
            item={project}
            getId={(item) => item.id}
            onEdit={role === "admin" ? onEdit : undefined}
            onDelete={role === "admin" ? onDelete : undefined}
            fields={[
              // {
              //   label: "Клієнт",
              //   value: (item) => getClientName(item.clientId),
              // },
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
    </div>
  );
};
