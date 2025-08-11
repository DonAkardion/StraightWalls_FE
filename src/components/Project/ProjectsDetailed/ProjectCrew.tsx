"use client";
import React from "react";
import { Crew } from "@/types/crew";
import { Project } from "@/types/project";
import { Worker } from "@/types/worker";
import { ProjectCrewWorkersTable } from "./ProjectCrewWorkersTable/ProjectCrewWorkersTable";

interface Props {
  project: Project;
  crews: Crew[];
  workers: Worker[];
}

export const ProjectCrew = ({ project, crews, workers }: Props) => {
  return (
    <section>
      <h2 className="">
        Бригада {crews.find((c) => c.id === project.crewId)?.name || "Невідомо"}
      </h2>
      <ProjectCrewWorkersTable
        workers={workers}
        crewId={project.crewId}
        crews={crews}
      />
    </section>
  );
};
