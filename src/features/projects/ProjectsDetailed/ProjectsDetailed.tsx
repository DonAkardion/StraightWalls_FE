"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContextProvider";

import { getProjectReport } from "@/api/projects";
import { ProjectReportResponse } from "@/types/project";

import { ProjectInfo } from "@/components/Project/ProjectsDetailed/ProjectInfo/ProjectInfo";
import { ProjectEstimateComplete } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimateComplete";
import { ProjectMaterials } from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterials";
import { ProjectPayment } from "@/components/Project/ProjectsDetailed/ProjectPayment/ProjectPayment";
import { ProjectCrew } from "@/components/Project/ProjectsDetailed/ProjectCrew/ProjectCrew";
import { ProjectNotes } from "@/components/Project/ProjectsDetailed/ProjectNotes/ProjectNotes";

interface Props {
  projectId: number;
}

export function ProjectsDetailed({ projectId }: Props) {
  const { token } = useUser();
  const [report, setReport] = useState<ProjectReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchProjectReport = async () => {
      try {
        const data = await getProjectReport(projectId, token);
        setReport(data ?? null);
      } catch (err) {
        console.error("Не вдалося завантажити репорт проєкту:", err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectReport();
  }, [projectId, token]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (!report) {
    return <div>Проєкт з ID {projectId} не знайдено</div>;
  }

  const project = report.project;

  return (
    <div className="m-auto pl-[20px] pr-[20px] pt-[76px] pb-[40px] md:pl-[80px] md:pr-[56px] md:pt-[60px] md:pb-[48px] ">
      <div>
        {project.client && <ProjectInfo report={report} />}

        <ProjectEstimateComplete
          report={report}
          // tableClassName="projectDetailedEstimateTableWrap"
          tablesTitle="Кошторис"
        />
        <ProjectMaterials report={report} />
        {/* <ProjectPayment /> */}
        {/* <ProjectCrew project={report.project} crews={project.team} /> */}
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
