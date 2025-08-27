"use client";
import React from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import { mockProjects } from "@/mock/Project/mockProjects";
import { mockServices } from "@/mock/Service/servicesMock";
import { mockWorkers } from "@/mock/Workers/workersMock";
import { mockCrews } from "@/mock/Crew/crewMock";
import { ProjectInfo } from "@/components/Project/ProjectsDetailed/ProjectInfo/ProjectInfo";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
import { ProjectMaterials } from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterials";
import { ProjectPayment } from "@/components/Project/ProjectsDetailed/ProjectPayment/ProjectPayment";
import { ProjectCrew } from "@/components/Project/ProjectsDetailed/ProjectCrew/ProjectCrew";
import { ProjectNotes } from "@/components/Project/ProjectsDetailed/ProjectNotes/ProjectNotes";

interface Props {
  projectId: number;
}

export function ProjectsDetailed({ projectId }: Props) {
  const project = mockProjects.find((c) => c.id === projectId);
  if (!project) {
    return <div>ProjectsDetailed не знайдено</div>;
  }
  const client = mockClients.find((cl) => cl.id === project.team_id);

  return (
    <div className="m-auto pl-[20px] pr-[20px] pt-[76px] pb-[40px] md:pl-[80px] md:pr-[56px] md:pt-[60px] md:pb-[48px] ">
      <div>
        {client && <ProjectInfo client={client} project={project} />}

        <ProjectEstimate
          services={mockServices}
          tableClassName="projectDetailedEstimateTableWrap"
          tablesTitle="Кошторис"
        />
        <ProjectMaterials />
        <ProjectPayment />
        <ProjectCrew
          project={project}
          crews={mockCrews}
          workers={mockWorkers}
        />
        <ProjectNotes
          subtitle="Також звертаємо Вашу увагу, що Замовник забезпечує:"
          notes={[
            "Повний доступ до Об'єкта (Дозвіл на проведення штукатурних робіт (в різних ЖК свої умови, уточніть на охороні))",
            "Повний доступ до стін та наявність санвузла",
            "Водопровід, каналізацію для квартир",
            "Електроенергію 220/380В",
          ]}
        />
      </div>
    </div>
  );
}
