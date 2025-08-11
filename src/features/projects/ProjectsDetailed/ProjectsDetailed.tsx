"use client";
import React from "react";
import styles from "./ProjectsDetailed.module.css";
import { mockProjects } from "@/mock/Project/mockProjects";
import { mockServices } from "@/mock/Service/servicesMock";
import { mockWorkers } from "@/mock/Workers/workersMock";
import { mockCrews } from "@/mock/Crew/crewMock";
import { mockClients } from "@/mock/Clients/clientsMock";
import { ProjectInfo } from "@/components/Project/ProjectsDetailed/ProjectInfo/ProjectInfo";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
import { ProjectCrew } from "@/components/Project/ProjectsDetailed/ProjectCrew";

interface Props {
  projectId: string;
}

export function ProjectsDetailed({ projectId }: Props) {
  const project = mockProjects.find((c) => c.id === projectId);
  if (!project) {
    return <div>ProjectsDetailed не знайдено</div>;
  }
  const client = mockClients.find((cl) => cl.id === project.clientId);

  return (
    <div className=" max-w-[1126px] m-auto pl-[10px] pr-[10px] pt-[76px] pb-[40px] md:pl-[80px] md:pr-[56px] md:pt-[60px] md:pb-[48px] ">
      <div>
        {client && <ProjectInfo client={client} project={project} />}
        <h2 className={`${styles.moduleTytle}`}>Кошторис</h2>
        <ProjectEstimate services={mockServices} />
        <div>ProjectMaterials</div>
        <div>ProjectPayment</div>
        <ProjectCrew
          project={project}
          crews={mockCrews}
          workers={mockWorkers}
        />
        <div>ProjectNotes</div>
      </div>
    </div>
  );
}
