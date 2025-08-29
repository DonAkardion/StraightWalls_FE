"use client";
import React, { useState, useEffect } from "react";
import styles from "./AllProjectsList.module.css";

import { getClientById } from "@/api/clients";
import { getClientById as getCrewById } from "@/api/crews";
import { getProjectReport } from "@/api/projects";
import { useUser } from "@/context/UserContextProvider";

import { Crew } from "@/types/crew";
import { Client } from "@/types/client";

import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";

import tableStyles from "@/components/Table/Table.module.css";

interface Props {
  projects: Project[];
  onDelete: (id: number) => void;
  onEdit: (updated: Project) => void;
  onAdd: () => void;
  role?: string;
  enableTooltips?: boolean;
  tablesTytle?: string;
}

export const AllProjectsList = ({
  projects,
  onDelete,
  onEdit,
  role,
  enableTooltips = true,
  tablesTytle,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [clientsMap, setClientsMap] = useState<Record<number, string>>({});
  const [crewsMap, setCrewsMap] = useState<Record<number, string>>({});
  const [costsMap, setCostsMap] = useState<Record<number, number>>({});
  const router = useRouter();
  const { token } = useUser();

  const handleRowClick = (id: number) => {
    if (!role) return;
    router.push(`/${role}/projects/projectsDetailed/${id}`);
  };

  useEffect(() => {
    const fetchRelated = async () => {
      const newClients: Record<number, string> = {};
      const newCrews: Record<number, string> = {};
      const newCosts: Record<number, number> = {};

      if (!token) return;

      await Promise.all(
        projects.map(async (p) => {
          if (p.client_id && !clientsMap[p.client_id]) {
            try {
              const client = await getClientById(token, p.client_id);
              newClients[p.client_id] = client.full_name ?? "Відсутній Клієнт";
            } catch {
              newClients[p.client_id] = "Помилка клієнта";
            }
          }
          if (p.team_id && !crewsMap[p.team_id]) {
            try {
              const crew = await getCrewById(token, p.team_id);
              newCrews[p.team_id] = crew.name ?? "Відсутня бригада";
            } catch {
              newCrews[p.team_id] = "Помилка бригади";
            }
          }
          if (!costsMap[p.id]) {
            try {
              const report = await getProjectReport(p.id, token);
              newCosts[p.id] = report.totalProjectCost ?? 0;
            } catch {
              newCosts[p.id] = 0;
            }
          }
        })
      );

      setClientsMap((prev) => ({ ...prev, ...newClients }));
      setCrewsMap((prev) => ({ ...prev, ...newCrews }));
      setCostsMap((prev) => ({ ...prev, ...newCosts }));
    };

    if (projects.length) {
      fetchRelated();
    }
  }, [projects]);

  const getClientName = (clientId: number) =>
    clientsMap[clientId] ?? "Завантаження...";

  const getCrewName = (crewId: number) => crewsMap[crewId] ?? "Завантаження...";

  const getCost = (projectId: number) =>
    costsMap[projectId] !== undefined ? costsMap[projectId] : "Завантаження...";

  const getRowClassName = (project: Project) => {
    switch (project.status) {
      case "new":
        return tableStyles.completedRow;
      case "in_progress":
        return tableStyles.waitingRow;
      case "completed":
        return tableStyles.inprogressRow;
      case "canceled":
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
            render: (project) => getClientName(project.client_id),
            tooltip: (project) => `Клієнт: ${getClientName(project.client_id)}`,
          },
          {
            key: "budget",
            label: "Вартість",
            render: (project) => getCost(project.id),
            tooltip: (project) => `Вартість: ${getCost(project.id)}`,
          },
          {
            key: "crewId",
            label: "Бригада",
            render: (project) => getCrewName(project.team_id),
            tooltip: (project) => `Бригада: ${getCrewName(project.team_id)}`,
          },
          // {
          //   key: "dateRange",
          //   label: "Термін",
          //   render: (project) => `${project.startDate}/${project.endDate}`,
          //   tooltip: (project) =>
          //     `Термін: ${project.startDate} / ${project.endDate}`,
          // },
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
                value: (item) => getClientName(item.client_id),
              },
              {
                label: "Бригада",
                value: (item) => getCrewName(item.team_id),
              },
              // {
              //   label: "Початок",
              //   value: (item) => item.startDate,
              // },
              // {
              //   label: "Завершення",
              //   value: (item) => item.endDate,
              // },
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
