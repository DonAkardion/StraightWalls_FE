"use client";
import React, { useEffect, useState } from "react";
import styles from "./ProjectCrew.module.css";
import { Worker } from "@/types/worker";
import { ProjectCrewWorkersTable } from "../ProjectCrewWorkersTable/ProjectCrewWorkersTable";
import { handleGetCrewWorkers } from "@/api/crews";
import { useUser } from "@/context/UserContextProvider";

interface Props {
  crewId: number;
  crewName: string;
}

export const ProjectCrew = ({ crewId, crewName }: Props) => {
  const { token } = useUser();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!crewId || !token) return;

    const fetchWorkers = async () => {
      try {
        const data = await handleGetCrewWorkers(crewId, token);
        setWorkers(data);
      } catch (error) {
        console.error("Помилка завантаження робітників:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [crewId, token]);

  if (!crewId) return null;

  const handleInspect = (item: Worker) => {
    setExpandedId((prev) => (prev === item.id ? null : item.id));
  };

  return (
    <section>
      <h2 className={`${styles.sectionTytle} mb-[16px]`}>
        Бригада &quot;{crewName}&quot;
      </h2>

      {loading ? (
        <p className="py-[20px] px-[10px]">Завантаження...</p>
      ) : workers.length > 0 ? (
        <ProjectCrewWorkersTable
          workers={workers}
          expandedId={expandedId}
          onInspect={handleInspect}
        />
      ) : (
        <p className={`${styles.Warning} py-[20px] px-[10px]`}>
          У цій бригаді поки немає робітників
        </p>
      )}
    </section>
  );
};
