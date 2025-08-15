"use client";

import React from "react";
import styles from "./ClientsProjectsTable.module.css"
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
  const projectColumns = [
    { key: "projectNumber", label: "Номер проекту" },
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
        columns={projectColumns}
        showIndex={false}
      />
    </div>
  );
};
