"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContextProvider";

import { getProjectReport } from "@/api/projects";
import { ProjectReportResponse } from "@/types/project";
import { createPayment, Payment } from "@/api/payments";

import { ProjectInfo } from "@/components/Project/ProjectsDetailed/ProjectInfo/ProjectInfo";
import { ProjectEstimateComplete } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimateComplete";
import { ProjectMaterials } from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterials";
import { ProjectPayment } from "@/components/Project/ProjectsDetailed/ProjectPayment/ProjectPayment";
import {
  ProjectPaymentForm,
  ProjectPaymentData,
} from "@/components/Project/ProjectsDetailed/ProjectPaymentForm/ProjectPaymentForm";
import { ProjectCrew } from "@/components/Project/ProjectsDetailed/ProjectCrew/ProjectCrew";
import { ProjectNotes } from "@/components/Project/ProjectsDetailed/ProjectNotes/ProjectNotes";

interface Props {
  projectId: number;
}

export function ProjectsDetailed({ projectId }: Props) {
  const { token } = useUser();
  const [report, setReport] = useState<ProjectReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [submitting, setSubmitting] = useState(false);

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

  const handleCreatePayment = async (payment: ProjectPaymentData) => {
    if (!token || !report) return;
    setSubmitting(true);
    try {
      const newPayment = await createPayment(
        {
          project_id: report.project.id,
          name: payment.name,
          description: payment.description,
          amount: payment.amount,
          status: payment.status,
        },
        token
      );

      setPayments((prev) => [...prev, newPayment]); // додаємо в список
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

  return (
    <div className="m-auto max-w-[1440px] pl-[20px] pr-[20px] pt-[76px] pb-[40px] md:pl-[80px] md:pr-[56px] md:pt-[60px] md:pb-[48px] ">
      <div>
        {project.client && <ProjectInfo report={report} />}
        <ProjectMaterials report={report} />
        <ProjectEstimateComplete
          report={report}
          tableClassName="projectDetailedEstimateCompleteTableWrap"
          tablesTitle="Кошторис"
        />

        <ProjectPayment report={report} />
        <ProjectCrew
          crewId={report.project.team_id}
          crewName={report.project.team.name}
        />
        <ProjectPaymentForm onSubmit={handleCreatePayment} />
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
