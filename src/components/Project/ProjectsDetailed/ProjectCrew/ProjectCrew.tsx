"use client";
import React from "react";
import styles from "./ProjectCrew.module.css";
import { Crew } from "@/types/crew";
import { Project } from "@/types/project";
import { Worker } from "@/types/worker";
import { ProjectCrewWorkersTable } from "../ProjectCrewWorkersTable/ProjectCrewWorkersTable";

interface Props {
  project: Project;
  crews: Crew[];
  workers: Worker[];
}

export const ProjectCrew = ({ project, crews, workers }: Props) => {
  const crew = crews.find((c) => c.id === project.crewId);
  if (!project.crewId || !crew) return null;

  const crewWorkers = workers.filter((w) => w.crewId === project.crewId);

  return (
    <section>
      <h2 className={`${styles.sectionTytle}`}>
        Бригада &quot;{crew.name}&quot;
      </h2>
      {crewWorkers.length > 0 ? (
        <ProjectCrewWorkersTable
          workers={workers}
          crewId={project.crewId}
          crews={crews}
        />
      ) : (
        <p className={`${styles.Warning} py-[20px] px-[10px]`}>
          У цій бригаді поки немає робітників
        </p>
      )}
    </section>
  );
};
