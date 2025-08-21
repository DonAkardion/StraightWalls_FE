"use client";
import React from "react";
import styles from "./AddProjectCrew.module.css";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { ProjectCrewWorkersTable } from "@/components/Project/ProjectsDetailed/ProjectCrewWorkersTable/ProjectCrewWorkersTable";

interface Props {
  crewId: number | null;
  crews: Crew[];
  workers: Worker[];
}
export const AddProjectCrew = ({ crewId, crews, workers }: Props) => {
  const crew = crews.find((c) => c.id === crewId);
  if (!crewId || !crew) return null;
  const crewWorkers = workers.filter((w) => w.crewId === crewId);
  return (
    <section>
      <h2 className={`${styles.sectionTytle} mb-[10px] md:mb-[16px]`}>
        Бригада &quot;{crew.name}&quot;
      </h2>
      {crewWorkers.length > 0 ? (
        <ProjectCrewWorkersTable
          workers={workers}
          crewId={crewId}
          crews={crews}
        />
      ) : (
        <p className={`${styles.Warning} text-2xl py-[20px] px-[10px]`}>
          У цій бригаді поки немає робітників
        </p>
      )}
    </section>
  );
};
