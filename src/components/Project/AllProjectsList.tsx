"use client";
import React, { useState, useEffect } from "react";
import styles from "./AllProjectsList.module.css";
import tableStyles from "@/components/Table/Table.module.css";

import { useUser } from "@/context/UserContextProvider";
import { useRouter } from "next/navigation";

import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";

import { Project } from "@/types/project";
import { getProjectReport } from "@/api/projects";
import { ProjectReportResponse } from "@/types/project";

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
  const [reportsMap, setReportsMap] = useState<
    Record<number, ProjectReportResponse | undefined>
  >({});
  const router = useRouter();
  const { token } = useUser();

  const handleRowClick = (id: number) => {
    if (!role) return;
    router.push(`/${role}/projects/projectsDetailed/${id}`);
  };

  useEffect(() => {
    if (!token || !projects.length) return;

    const idsToFetch = projects
      .map((p) => p.id)
      .filter((id) => reportsMap[id] === undefined);

    if (!idsToFetch.length) return;

    (async () => {
      try {
        const results = await Promise.all(
          idsToFetch.map(async (id) => {
            try {
              const rep = await getProjectReport(id, token);
              return [id, rep] as const;
            } catch (e) {
              console.error("Не вдалося завантажити репорт проєкту", id, e);
              return [id, undefined] as const;
            }
          })
        );

        setReportsMap((prev) => {
          const merged = { ...prev };
          for (const [id, rep] of results) merged[id] = rep;
          return merged;
        });
      } catch (e) {
        console.error("Помилка батч-завантаження репортів", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, token]);

  const getClientName = (projectId: number) => {
    const rep = reportsMap[projectId];
    return rep ? rep.project.client.full_name : "Завантаження...";
  };

  const getCrewName = (projectId: number) => {
    const rep = reportsMap[projectId];
    return rep ? rep.project.team?.name ?? "—" : "Завантаження...";
  };

  const getObjectNameAddr = (projectId: number) => {
    const rep = reportsMap[projectId];
    if (!rep) return "Завантаження...";
    const obj = rep.project.object;
    return obj ? `${obj.name}: ${obj.address}` : "—";
  };

  const getCost = (projectId: number) => {
    const rep = reportsMap[projectId];
    return rep ? rep.totalProjectCost : "Завантаження...";
  };

  const getRowClassName = (project: Project) => {
    switch (project.status) {
      case "completed":
        return tableStyles.completedRow;
      case "new":
        return tableStyles.waitingRow;
      case "in_progress":
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
            render: (project) => getClientName(project.id),
            tooltip: (project) => `Клієнт: ${getClientName(project.id)}`,
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
            render: (project) => getCrewName(project.id),
            tooltip: (project) => `Бригада: ${getCrewName(project.id)}`,
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
