"use client";
import React, { useState, useEffect } from "react";
import styles from "./AllProjectsList.module.css";
import tableStyles from "@/components/Table/Table.module.css";

import { useUser } from "@/context/UserContextProvider";
import { useRouter } from "next/navigation";

import { StatusSelector } from "@/components/Project/EditComponents/StatusSelector";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";

import { Project } from "@/types/project";
import { getProjectReport } from "@/api/projects";
import { ProjectReportResponse } from "@/types/project";
import { changeProjectStatus } from "@/api/projects";

interface Props {
  projects: Project[];
  onDelete: (id: number) => void;
  onEdit: (updated: Project) => void;
  onAdd: () => void;
  role?: string;
  enableTooltips?: boolean;
  tablesTytle?: string;
  onRefreshReport?: (id: number) => void;
}

const statusMap: Record<string, string> = {
  completed: "Виконано",
  in_progress: "В процесі",
  new: "Очікує",
  canceled: "Відхилено",
};

export const AllProjectsList = ({
  projects,
  onDelete,
  onEdit,
  role,
  enableTooltips = true,
  tablesTytle,
  onRefreshReport,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reportsMap, setReportsMap] = useState<
    Record<number, ProjectReportResponse | undefined>
  >({});
  const router = useRouter();
  const { token } = useUser();

  const [statusState, setStatusState] = useState<Record<number, string>>({});
  const [filterStatus, setFilterStatus] = useState<string>("");

  const filteredProjects = filterStatus
    ? projects.filter((p) => {
        const currentStatus = statusState[p.id] || p.status;
        return currentStatus === filterStatus;
      })
    : projects;

  const handleRowClick = (id: number) => {
    if (!role) return;
    router.push(`/${role}/projects/projectsDetailed/${id}`);
  };

  const handleStatusChange = async (projectId: number, newStatus: string) => {
    if (!token) return;
    try {
      await changeProjectStatus(projectId, token, { status: newStatus });
      setStatusState((prev) => ({ ...prev, [projectId]: newStatus }));
    } catch (e) {
      console.error("Не вдалося змінити статус проєкту:", e);
    }
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

  const getRowClassName = (project: Project) => {
    const status = statusState[project.id] || project.status;
    switch (status) {
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

  const refreshReport = async (id: number) => {
    if (!token) return;
    try {
      const rep = await getProjectReport(id, token);
      setReportsMap((prev) => ({ ...prev, [id]: rep }));
    } catch (e) {
      console.error("Не вдалося оновити репорт", e);
    }
  };

  return (
    <div className="mb-[60px] relative">
      <div className="flex justify-between items-center mb-[10px] md:mb-[16px]">
        <h2 className={`${styles.projectsTytle} `}>{tablesTytle}</h2>
        {/* Фільтр по статусу */}
        <div className="flex items-center gap-2">
          <span className={`${styles.projectsState} mb-1`}>Статус:</span>
          <StatusSelector
            value={filterStatus || ""}
            options={{ "": "Всі", ...statusMap }}
            onChange={(val) => setFilterStatus(val)}
          />
        </div>
      </div>
      <Table<Project>
        data={filteredProjects}
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
            render: (project) => `${project.name} №${project.id}`,
            tooltip: (project) => `Проєкт: ${project.name} №${project.id}`,
          },
          {
            key: "clientId",
            label: "Клієнт",
            render: (project) => getClientName(project.id),
            tooltip: (project) => `Клієнт: ${getClientName(project.id)}`,
          },
          {
            key: "crewId",
            label: "Бригада",
            render: (project) => getCrewName(project.id),
            tooltip: (project) => `Бригада: ${getCrewName(project.id)}`,
          },
          {
            key: "dateRange",
            label: "Термін",
            render: (project) =>
              `${project.start_date ? project.start_date : "Початок"} / ${
                project.end_date ? project.end_date : "Кінець"
              }`,
            tooltip: (project) =>
              `Термін: ${
                project.start_date ? project.start_date : "Початок"
              } / ${project.end_date ? project.end_date : "Кінець"}`,
          },
          {
            key: "status",
            label: "Статус",
            render: (project) => {
              const currentStatus = statusState[project.id] || project.status;
              return (
                <StatusSelector
                  value={currentStatus}
                  options={statusMap}
                  onChange={(newStatus) =>
                    handleStatusChange(project.id, newStatus)
                  }
                />
              );
            },
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
                value: (item) => getClientName(item.client_id),
              },
              {
                label: "Бригада",
                value: (item) => getCrewName(item.team_id),
              },
              {
                label: "Початок",
                value: (item) => {
                  item.start_date ? item.start_date : "Початок";
                },
              },
              {
                label: "Завершення",
                value: (item) => {
                  item.end_date ? item.end_date : "Кінець";
                },
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
