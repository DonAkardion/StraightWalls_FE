"use client";

import React, { useState } from "react";
import styles from "./ClientsProjectsTable.module.css";
import { Table } from "@/components/Table/Table";
import { clientsProjectsData } from "@/mock/Clients/clientsProjectsTable";
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders";

interface Project {
  id: string | number;
  projectNumber: string;
  cost: string | number;
  team: string;
  period: string;
  status: "active" | "inactive" | string;
}

export const ClientsProjectsTable = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const projectColumns = [
    { key: "projectNumber", label: "Номер проєкту" },
    { key: "cost", label: "Вартість" },
    { key: "team", label: "Бригада" },
    { key: "period", label: "Початок / кінець" },
    {
      key: "status",
      label: "",
      render: (item: Project) => (
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: item.status === "active" ? "green" : "gray",
            marginLeft: 10,
          }}
          title={item.status === "active" ? "Активний" : "Неактивний"}
        />
      ),
    },
  ];

  return (
    <div className={`${styles.clientsProjectsTable} w-full`}>
      <ProjectsHeaders
        headers={["Проєкти"]}
        className="text-black text-[36px] mt-5 mb-3 font-inter"
      />
      <Table
        data={clientsProjectsData}
        expandedId={expandedId}
        columns={projectColumns}
        showIndex={false}
        className="clientsDetailedProjectsWrap"
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        renderInspection={(projectColumns) => (
          <div className=" pb-1  bg-white border-b-1 relative">
            <div className="pl-[20px] pr-[10px] flex flex-col gap-2 ">
              <div className={`${styles.inspectRow} flex justify-between`}>
                <p>
                  <span>Вартість: </span>
                  <span className="text-sm ">{projectColumns.cost}</span>
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  <span>Бригада: </span>
                  <span className="text-sm ">{projectColumns.team}</span>
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  <span>Початок / кінець: </span>
                  <span className="text-sm ">{projectColumns.period}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
