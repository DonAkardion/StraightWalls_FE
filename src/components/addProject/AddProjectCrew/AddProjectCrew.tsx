"use client";
import React from "react";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { ProjectCrewWorkersTable } from "@/components/Project/ProjectsDetailed/ProjectCrewWorkersTable/ProjectCrewWorkersTable";

interface Props {
  crewId: string | null;
  crews: Crew[];
  workers: Worker[];
}
export const AddProjectCrew = ({ crewId, crews, workers }: Props) => {
  const crew = crews.find((c) => c.id === crewId);
  if (!crewId || !crew) return null;
  return (
    <section>
      <h2 className="">Бригада {crew.name}</h2>
      <ProjectCrewWorkersTable
        workers={workers}
        crewId={crewId}
        crews={crews}
      />
    </section>
  );
};
