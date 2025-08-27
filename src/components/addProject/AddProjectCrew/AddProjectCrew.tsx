"use client";

import React, { useEffect, useState } from "react";
import styles from "./AddProjectCrew.module.css";
import { Worker } from "@/types/worker";
import { ProjectCrewWorkersTable } from "@/components/Project/ProjectsDetailed/ProjectCrewWorkersTable/ProjectCrewWorkersTable";
import { handleGetCrewWorkers } from "@/api/crews";

interface Props {
  team_id: number | null;
}

export const AddProjectCrew = ({ team_id }: Props) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!team_id) {
      setWorkers([]);
      return;
    }

    const fetchCrewWorkers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const crewWorkers = await handleGetCrewWorkers(team_id, token);
        setWorkers(crewWorkers);
      } catch (error) {
        console.error("Помилка при завантаженні робітників:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrewWorkers();
  }, [team_id]);

  if (!team_id) return null;

  const handleInspect = (item: Worker) => {
    setExpandedId((prev) => (prev === item.id ? null : item.id));
  };

  return (
    <section>
      {loading ? (
        <p>Завантаження працівників...</p>
      ) : workers.length > 0 ? (
        <ProjectCrewWorkersTable
          workers={workers}
          expandedId={expandedId}
          onInspect={handleInspect}
        />
      ) : (
        <p className={`${styles.Warning} text-2xl py-[20px] px-[10px]`}>
          У цій бригаді поки немає робітників
        </p>
      )}
    </section>
  );
};
