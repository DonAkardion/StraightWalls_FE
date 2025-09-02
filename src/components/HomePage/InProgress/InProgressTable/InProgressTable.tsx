"use client";
import styles from "./InProgressTable.module.css";
import React, { useState, useMemo } from "react";
import { Table } from "@/components/Table/Table";
import { ProjectReportResponse } from "@/types/project";

interface InProgressTableProps {
  reports: ProjectReportResponse[];
  className?: string;
}

export const InProgressTable: React.FC<InProgressTableProps> = ({
  reports,
  className,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // групуємо проєкти по бригадах
  const crewsWithProjects = useMemo(() => {
    const map = reports.reduce<Record<number, ProjectReportResponse[]>>(
      (acc, report) => {
        const crewId = report.project.team_id;
        if (!acc[crewId]) acc[crewId] = [];
        acc[crewId].push(report);
        return acc;
      },
      {}
    );

    return Object.values(map).map((crewReports) => {
      // сортуємо проєкти по created_at
      crewReports.sort(
        (a, b) =>
          new Date(a.project.created_at).getTime() -
          new Date(b.project.created_at).getTime()
      );

      const crew = crewReports[0].project.team;

      return {
        id: crew.id,
        name: crew.name,
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
              // className={`${
              //   idx === 0
              //     ? styles.pastOrder
              //     : idx === 1
              //     ? styles.currentOrder
              //     : styles.futureOrder
              // } ${styles.hideOnMobile}`}
            >
              {p.project.name}
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
          {row.projects.map((p, idx) => (
            <div
              key={p.project.id}
              className={getRowClassName(p.project.status)}
              // className={
              //   idx === 0
              //     ? styles.pastOrder
              //     : idx === 1
              //     ? styles.currentOrder
              //     : styles.futureOrder
              // }
            >
              {statusMap[p.project.status] || p.project.status}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "nextStage",
      label: "Наступний етап",
      render: (row: (typeof crewsWithProjects)[0]) => (
        <div className="flex flex-col gap-[10px]">
          {row.projects.map((p, idx) => (
            <div
              key={p.project.id}
              className={getRowClassName(p.project.status)}
              // className={
              //   idx === 0
              //     ? styles.pastOrder
              //     : idx === 1
              //     ? styles.currentOrder
              //     : styles.futureOrder
              // }
            >
              Здати
            </div>
          ))}
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
              // className={
              //   idx === 0
              //     ? styles.pastOrder
              //     : idx === 1
              //     ? styles.currentOrder
              //     : styles.futureOrder
              // }
            >
              {p.totalMaterialsProfit}
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
              // className={
              //   idx === 0
              //     ? styles.pastOrder
              //     : idx === 1
              //     ? styles.currentOrder
              //     : styles.futureOrder
              // }
            >
              {p.totalMaterialsProfit}
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
      showIndex={true}
      onInspect={(item) =>
        setExpandedId((prev) => (prev === item.id ? null : item.id))
      }
      expandedId={expandedId}
      className={className}
      renderInspection={(row) => (
        <div className="p-2 pl-3 md:hidden flex flex-col gap-1">
          {row.projects.map((p) => (
            <div
              key={p.project.id}
              className={`${getRowClassName(p.project.status)} ${
                styles.inspectText
              }`}
            >
              <div className="flex justify-between gap-2 text-nowrap">
                <span className="w-1/2 truncate">{p.project.name}</span>
                <span className="w-1/4 truncate">
                  {statusMap[p.project.status] || p.project.status}
                </span>
                <span className="w-1/4 truncate">Здати</span>
                <span className="w-1/4 truncate">{`${p.totalMaterialsProfit} грн`}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
};
