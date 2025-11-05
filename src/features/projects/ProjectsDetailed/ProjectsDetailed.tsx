"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@/context/UserContextProvider";

import { getProjectReport } from "@/api/projects";
import { ProjectReportResponse } from "@/types/project";
import { createPayment, Payment } from "@/api/payments";
import { useParams } from "next/navigation";
import { ProjectInfo } from "@/components/Project/ProjectsDetailed/ProjectInfo/ProjectInfo";
import { ProjectEstimateComplete } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimateComplete";
import { ProjectMaterialsComplete } from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterialsComplete";
import { FakeMaterialTable } from "@/components/Project/ProjectsDetailed/FakeMaterial/FakeMaterialTable";
import { ProjectPayment } from "@/components/Project/ProjectsDetailed/ProjectPayment/ProjectPayment";
import {
  ProjectPaymentForm,
  ProjectPaymentData,
} from "@/components/Project/ProjectsDetailed/ProjectPaymentForm/ProjectPaymentForm";
import { ProjectCrew } from "@/components/Project/ProjectsDetailed/ProjectCrew/ProjectCrew";
import { ProjectNotes } from "@/components/Project/ProjectsDetailed/ProjectNotes/ProjectNotes";
import { ProjectStages } from "@/components/Project/ProjectsDetailed/ProjectStages/ProjectStage";

interface Props {
  projectId: number;
}

export function ProjectsDetailed({ projectId }: Props) {
  const { role } = useParams();
  const roleStr = Array.isArray(role) ? role[0] : role ?? "";
  const { token } = useUser();
  const [report, setReport] = useState<ProjectReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refreshProject = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getProjectReport(projectId, token);
      setReport(data ?? null);
    } catch (err) {
      console.error("Не вдалося завантажити репорт проєкту:", err);
      setReport(null);
    }
  }, [projectId, token]);

  useEffect(() => {
    setLoading(true);
    refreshProject().finally(() => setLoading(false));
  }, [refreshProject]);

  const handleCreatePayment = async (payment: ProjectPaymentData) => {
    if (!token || !report) return;
    setSubmitting(true);
    try {
      await createPayment(
        {
          project_id: report.project.id,
          name: payment.name,
          description: payment.description,
          amount: payment.amount,
          status: payment.status,
          due_date: payment.due_date,
        },
        token
      );

      await refreshProject();
    } catch (err) {
      console.error("Помилка створення платежу:", err);
      alert("Не вдалося створити платіж");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (!report) {
    return <div>Проєкт з ID {projectId} не знайдено</div>;
  }

  const project = report.project;

  // === CALCULATE AREA AND PRICE ===
  const stats = project.object?.roomStats;
  const area = stats
    ? Number(stats.totalArea ?? 0) +
      Number(stats.totalSlopesMeters ?? 0) +
      Number(stats.totalElementsMeters ?? 0)
    : 0;

  const initialPrice = project.universal_material_price_per_m2
    ? Number(project.universal_material_price_per_m2)
    : undefined;

  return (
    <div className="m-auto max-w-[1440px] pl-[20px] pr-[20px] pt-[76px] pb-[40px] md:pl-[80px] md:pr-[56px] md:pt-[60px] md:pb-[48px] ">
      <div>
        {project.client && <ProjectInfo report={report} role={roleStr} />}
        <ProjectMaterialsComplete
          report={report}
          tableClassName="projectDetailedMaterialsCompleteTableWrap"
          tablesTitle="Матеріали"
          role={roleStr}
        />
        <FakeMaterialTable
          area={area}
          initialPrice={initialPrice}
          editable={false}
          viewMode={true}
          projectId={project.id}
          onUpdate={refreshProject}
        />
        <ProjectEstimateComplete
          report={report}
          tableClassName="projectDetailedEstimateCompleteTableWrap"
          tablesTitle="Кошторис"
          role={roleStr}
        />

        <ProjectPayment
          report={report}
          refreshProject={refreshProject}
          role={roleStr}
        />
        {project?.team && project?.team_id && (
          <ProjectCrew crewId={project.team_id} crewName={project.team.name} />
        )}
        {role === "admin" || role === "accountant" ? (
          <div>
            <ProjectPaymentForm onSubmit={handleCreatePayment} />
            <ProjectStages report={report} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
