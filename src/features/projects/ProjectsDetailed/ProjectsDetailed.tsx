"use client";
import React from "react";
import { mockProjects } from "@/mock/Project/mockProjects";
import { mockWorkers } from "@/mock/Workers/workersMock";
import { mockCrews } from "@/mock/Crew/crewMock";
import { ProjectCrew } from "@/components/Project/ProjectsDetailed/ProjectCrew";

interface Props {
  projectId: string;
}

export function ProjectsDetailed({ projectId }: Props) {
  const project = mockProjects.find((c) => c.id === projectId);
  if (!project) {
    return <div>ProjectsDetailed не знайдено</div>;
  }

  return (
    <div className="pl-[10px] pr-[10px] pt-[76px] pb-[40px] md:pl-[80px] md:pr-[56px] md:pt-[60px] md:pb-[48px] ">
      <div>
        <div>ProjectsInfo</div>
        <div>ProjectEstimate</div>
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
