"use client";

import React, { useEffect, useState } from "react";
import styles from "./ClientsProjectsTable.module.css";
import { Table } from "@/components/Table/Table";
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders";
import { getProjectByClientId } from "@/api/projects";

interface Project {
  id: number;
  projectNumber: string;
  cost: string | number;
  team: string;
  period: string;
  status: "active" | "inactive" | string;
}

interface Props {
  clientId: number;
}

export const ClientsProjectsTable = ({ clientId }: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [tableData, setTableData] = useState<Project[]>([]);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const fetchProjects = async () => {
  try {
    const data = await getProjectByClientId(clientId, token);

    const mapped = Array.isArray(data)
      ? data.map((p: any) => {
          const totalCost = p.works?.reduce(
            (sum: number, w: any) => sum + Number(w.cost ?? 0),
            0
          ) ?? 0;

          return {
            id: p.id,
            projectNumber: `Project-${p.id}`,
            cost: totalCost ? `${totalCost} грн` : "—",
            team: p.team?.name ?? "—",
            period: `${p.created_at?.slice(0, 10)} / ${p.updated_at?.slice(0, 10)}`,
            status: p.status, 
          };
        })
      : [];

    setTableData(mapped);
    console.log("Mapped projects:", mapped);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

  fetchProjects()


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
        data={tableData}
        expandedId={expandedId}
        columns={projectColumns}
        showIndex={false}
        className="clientsDetailedProjectsWrap"
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        renderInspection={(project) => (
          <div className="pb-1 bg-white border-b-1 relative">
            <div className="pl-[20px] pr-[10px] flex flex-col gap-2">
              <div className={`${styles.inspectRow} flex justify-between`}>
                <p>
                  <span>Вартість: </span>
                  <span className="text-sm">{project.cost}</span>
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  <span>Бригада: </span>
                  <span className="text-sm">{project.team}</span>
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  <span>Початок / кінець: </span>
                  <span className="text-sm">{project.period}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
