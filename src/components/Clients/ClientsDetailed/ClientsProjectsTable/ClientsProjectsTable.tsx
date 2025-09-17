"use client";

import React, { useEffect, useState } from "react";
import styles from "./ClientsProjectsTable.module.css";
import { Table } from "@/components/Table/Table";
import tableStyles from "@/components/Table/Table.module.css";
import { Project, ProjectReportResponse } from "@/types/project";
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders";
import { getProjectByClientId, getProjectReport } from "@/api/projects";
import { useUser } from "@/context/UserContextProvider";

interface Props {
  clientId: number;
  enableTooltips?: boolean;
}

export const ClientsProjectsTable = ({
  clientId,
  enableTooltips = true,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reportsMap, setReportsMap] = useState<
    Record<number, ProjectReportResponse | undefined>
  >({});
  const { token } = useUser();

  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const data = await getProjectByClientId(clientId, token);

        if (Array.isArray(data)) setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [token, clientId])


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
              console.error("Не вдалося завантажити репорт", id, e);
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
        console.error("Помилка завантаження репортів", e);
      }
    })();
  }, [projects, token, reportsMap]);

  const statusMap: Record<string, string> = {
    completed: "Виконано",
    in_progress: "В Роботі",
    new: "В Черзі",
    canceled: "Скасовано",
  };

  const getStatusClass = (status: string) => {
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

  const projectColumns = [
    {
      key: "name",
      label: "Назва проєкту",
      tooltip: (p: Project) => `Назва: ${p.name}`,
    },
    {
      key: "cost",
      label: "Вартість",
      render: (p: Project) =>
        reportsMap[p.id]?.totalProjectCost
          ? `${reportsMap[p.id]!.totalProjectCost} грн`
          : "—",
    },
    {
      key: "team",
      label: "Бригада",
      render: (p: Project) => reportsMap[p.id]?.project.team?.name ?? "—",
    },
    {
      key: "dateRange",
      label: "Термін",
      render: (p: Project) =>
        `${p.start_date ? p.start_date : "Початок"} / ${
          p.end_date ? p.end_date : "Кінець"
        }`,
      tooltip: (p: Project) =>
        `Термін: ${p.start_date ? p.start_date : "Початок"} / ${
          p.end_date ? p.end_date : "Кінець"
        }`,
    },
    {
      key: "status",
      label: "Статус",
      render: (p: Project) => {
        const currentStatus = reportsMap[p.id]?.project.status ?? p.status;
        return (
          <span
            className={`${getStatusClass(currentStatus)} px-2 py-1 rounded `}
          >
            {statusMap[currentStatus] ?? currentStatus}
          </span>
        );
      },
    },
  ];

  return (
    <div className={`${styles.clientsProjectsTable} w-full`}>
      <ProjectsHeaders
        headers={["Проєкти"]}
        className="text-black text-[36px] mt-5 mb-3 font-inter"
      />
      <Table<Project>
        data={projects}
        expandedId={expandedId}
        columns={projectColumns}
        showIndex={false}
        className="clientsDetailedProjectsWrap"
        enableTooltips={enableTooltips}
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        renderInspection={(project) => {
          const report = reportsMap[project.id];
          const currentStatus = report?.project.status ?? project.status;
          return (
            <div className="pb-1 bg-white border-b-1 relative">
              <div className="pl-[20px] pr-[10px] flex flex-col gap-2">
                <div className={`${styles.inspectRow} flex justify-between`}>
                  <p>
                    <span>Вартість: </span>
                    <span className="text-sm">
                      {report?.totalProjectCost ?? "—"}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>
                    <span>Бригада: </span>
                    <span className="text-sm">
                      {report?.project.team?.name ?? "—"}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>
                    <span>Термін: </span>
                    <span className="text-sm">
                      {project.start_date ?? "Початок"} /{" "}
                      {project.end_date ?? "Кінець"}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>
                    <span>Статус: </span>
                    <span
                      className={`${getStatusClass(
                        currentStatus
                      )} px-2 py-1 rounded text-sm`}
                    >
                      {statusMap[currentStatus] ?? currentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
