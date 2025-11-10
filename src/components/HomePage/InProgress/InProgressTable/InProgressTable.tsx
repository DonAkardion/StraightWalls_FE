"use client";
import styles from "./InProgressTable.module.css";
import React, { useState, useMemo } from "react";
import { Table } from "@/components/Table/Table";
import { ProjectReportResponse } from "@/types/project";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProjectStage, StageStatus } from "@/types/stages";
import { useUser } from "@/context/UserContextProvider";

interface InProgressTableProps {
  reports: ProjectReportResponse[];
  className?: string;
  enableTooltips?: boolean;
}

export const InProgressTable: React.FC<InProgressTableProps> = ({
  reports,
  className,
  enableTooltips = true,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { user } = useUser();
  const role = user!.role;

  const router = useRouter();

  // групуємо проєкти по бригадах (або без бригади)
  const crewsWithProjects = useMemo(() => {
    const map = reports.reduce<Record<string, ProjectReportResponse[]>>(
      (acc, report) => {
        const crewId = report.project.team_id ?? "no_team";
        if (!acc[crewId]) acc[crewId] = [];
        acc[crewId].push(report);
        return acc;
      },
      {}
    );

    return Object.values(map).map((crewReports) => {
      crewReports.sort(
        (a, b) =>
          new Date(a.project.created_at).getTime() -
          new Date(b.project.created_at).getTime()
      );

      const crew = crewReports[0].project.team;

      return {
        id: crew?.id ?? -1,
        name: crew?.name ?? "Без бригади",
        projects: crewReports,
      };
    });
  }, [reports]);

  const statusMap: Record<string, string> = {
    completed: "Виконано",
    in_progress: "В процесі",
    new: "Очікує",
    canceled: "Відхилено",
  };

  const getRowClassName = (status: string) => {
    switch (status) {
      case "completed":
        return styles.pastOrder;
      case "new":
        return styles.futureOrder;
      case "in_progress":
        return styles.currentOrder;
      case "canceled":
        return styles.canceledOrder;
      default:
        return "";
    }
  };
  const ProjectStagesData: ProjectStage[] = [
    {
      id: "works_confirmed",
      label: "Підтвердження робіт та отримання авансу (4 000 ₴)",
      field: "is_works_confirmed",
    },
    {
      id: "start_date_agreed",
      label: "Узгодження дати старту",
      field: "is_start_date_agreed",
    },
    {
      id: "team_assigned",
      label: "Призначення бригади",
      field: "is_team_assigned",
    },
    {
      id: "keys_received",
      label: "Отримання ключів",
      field: "is_keys_received",
    },
    {
      id: "materials_prepaid",
      label: "Аванс на матеріали (4 000 ₴)",
      field: "is_materials_prepaid",
    },
    {
      id: "materials_ordered",
      label: "Замовлення матеріалів",
      field: "is_materials_ordered",
    },
    {
      id: "team_started",
      label: "Виїзд та встановлення бригади",
      field: "is_team_started",
    },
    {
      id: "details_clarified",
      label: "Уточнення нюансів",
      field: "is_details_clarified",
    },
    {
      id: "work_accepted",
      label: "Приймання роботи",
      field: "is_work_accepted",
    },
    {
      id: "work_delivered",
      label: "Здача роботи замовнику",
      field: "is_work_delivered",
    },
    {
      id: "final_payment_received",
      label: "Отримання остаточного розрахунку",
      field: "is_final_payment_received",
    },
    {
      id: "team_paid",
      label: "Виплата зарплати бригаді",
      field: "is_team_paid",
    },
  ];

  function getProjectStages(project: any) {
    const lastTrueIndex = [...ProjectStagesData]
      .reverse()
      .findIndex((stage) => project[stage.field as keyof typeof project]);

    if (lastTrueIndex === -1) {
      return { current: "-", next: ProjectStagesData[0].label };
    }

    const currentIndex = ProjectStagesData.length - 1 - lastTrueIndex;
    const currentStage = ProjectStagesData[currentIndex];

    let nextStage: string | null = null;
    for (let i = currentIndex + 1; i < ProjectStagesData.length; i++) {
      if (ProjectStagesData[i].id !== "rejected") {
        nextStage = ProjectStagesData[i].label;
        break;
      }
    }

    return {
      current: currentStage.label,
      next: nextStage,
    };
  }

  const columns = [
    {
      key: "projectCrew",
      label: "Бригада",
      render: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          <div>{row.name}</div>
          {row.projects.map((p, idx) => (
            <div
              key={p.project.id}
              className={`${getRowClassName(p.project.status)} ${
                styles.hideOnMobile
              }`}
            >
              <Link
                href={`/${role}/projects/projectsDetailed/${p.project.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block w-full h-full cursor-pointer"
              >
                №{p.project.id} {p.project.name}
              </Link>
            </div>
          ))}
        </div>
      ),
      tooltip: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          <div>{row.name}</div>
          {row.projects.map((p, idx) => (
            <div
              key={p.project.id}
              className={`${getRowClassName(p.project.status)} ${
                styles.hideOnMobile
              }`}
            >
              <Link
                href={`/${role}/projects/projectsDetailed/${p.project.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block w-full h-full cursor-pointer"
              >
                №{p.project.id} {p.project.name}
              </Link>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "currentStage",
      label: "Етап",
      render: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          {row.projects.map((p, idx) => {
            const { current } = getProjectStages(p.project);
            return (
              <div
                key={p.project.id}
                className={getRowClassName(p.project.status)}
              >
                {current}
              </div>
            );
          })}
        </div>
      ),
      tooltip: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          {row.projects.map((p, idx) => {
            const { current } = getProjectStages(p.project);
            return (
              <div
                key={p.project.id}
                className={getRowClassName(p.project.status)}
              >
                {current}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "nextStage",
      label: "Наступний етап",
      render: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          {row.projects.map((p, idx) => {
            const { next } = getProjectStages(p.project);
            return (
              <div
                key={p.project.id}
                className={getRowClassName(p.project.status)}
              >
                {next || "-"}
              </div>
            );
          })}
        </div>
      ),
      tooltip: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          {row.projects.map((p, idx) => {
            const { next } = getProjectStages(p.project);
            return (
              <div
                key={p.project.id}
                className={getRowClassName(p.project.status)}
              >
                {next || "-"}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "materialsIncome",
      label: "Зар. матеріали",
      render: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          {row.projects.map((p, idx) => (
            <div
              key={p.project.id}
              className={getRowClassName(p.project.status)}
            >
              {p.totalMaterialsProfit.toFixed(2)}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "crewSalary",
      label: "Зарплати",
      render: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          {row.projects.map((p, idx) => (
            <div
              key={p.project.id}
              className={getRowClassName(p.project.status)}
            >
              {p.totalMaterialsProfit.toFixed(2)}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={crewsWithProjects}
      columns={columns}
      enableTooltips={enableTooltips}
      showIndex={true}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      expandedId={expandedId}
      className={className}
      renderInspection={(row) => (
        <div className="p-2 pl-3 md:hidden flex flex-col gap-1">
          {row.projects.map((p) => {
            const { current, next } = getProjectStages(p.project);
            return (
              <div
                key={p.project.id}
                className={`${getRowClassName(p.project.status)} ${
                  styles.inspectText
                }`}
              >
                <div className="flex justify-between gap-2 text-nowrap">
                  <span className="w-1/2 truncate">
                    <Link
                      href={`/${role}/projects/projectsDetailed/${p.project.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="block w-full h-full cursor-pointer"
                    >
                      №{p.project.id} {p.project.name}
                    </Link>
                  </span>
                  <span className="w-1/4 truncate">{current}</span>
                  <span className="w-1/4 truncate">{next || "-"}</span>
                  <span className="w-1/4 truncate">{`${p.totalMaterialsProfit} грн`}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
};
