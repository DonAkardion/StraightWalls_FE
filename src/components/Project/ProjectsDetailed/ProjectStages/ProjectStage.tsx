"use client";
import React, { useState } from "react";
import styles from "./ProjectStage.module.css";
import { ProjectStage, StageStatus } from "@/types/stages";
import { ProjectReportResponse } from "@/types/project";
import { updateProjectStage } from "@/api/stages";
import { useUser } from "@/context/UserContextProvider";

interface Props {
  report: ProjectReportResponse;
}

const STAGE_COLORS = {
  active: "#4CAF50",
  inactive: "#9E9E9E",
};

export const ProjectStages = ({ report }: Props) => {
  const { token } = useUser();
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const [stageStatus, setStageStatus] = useState<StageStatus>({
    is_works_confirmed: report.project.is_works_confirmed,
    is_start_date_agreed: report.project.is_start_date_agreed,
    is_team_assigned: report.project.is_team_assigned,
    is_keys_received: report.project.is_keys_received,
    is_materials_prepaid: report.project.is_materials_prepaid,
    is_materials_ordered: report.project.is_materials_ordered,
    is_team_started: report.project.is_team_started,
    is_details_clarified: report.project.is_details_clarified,
    is_work_accepted: report.project.is_work_accepted,
    is_work_delivered: report.project.is_work_delivered,
    is_final_payment_received: report.project.is_final_payment_received,
    is_team_paid: report.project.is_team_paid,
  });

  const ProjectStagesData: ProjectStage[] = [
    {
      id: "works_confirmed",
      label: "Підтвердження робіт та отримання авансу (4 000 ₴)",
      field: "is_works_confirmed",
    },
    {
      id: "start_date_agreed",
      label: "Узгодження дати старту",
      field: "is_start_date_agreed",
    },
    {
      id: "team_assigned",
      label: "Призначення бригади",
      field: "is_team_assigned",
    },
    {
      id: "keys_received",
      label: "Отримання ключів",
      field: "is_keys_received",
    },
    {
      id: "materials_prepaid",
      label: "Аванс на матеріали (4 000 ₴)",
      field: "is_materials_prepaid",
    },
    {
      id: "materials_ordered",
      label: "Замовлення матеріалів",
      field: "is_materials_ordered",
    },
    {
      id: "team_started",
      label: "Виїзд та встановлення бригади",
      field: "is_team_started",
    },
    {
      id: "details_clarified",
      label: "Уточнення нюансів",
      field: "is_details_clarified",
    },
    {
      id: "work_accepted",
      label: "Приймання роботи",
      field: "is_work_accepted",
    },
    {
      id: "work_delivered",
      label: "Здача роботи замовнику",
      field: "is_work_delivered",
    },
    {
      id: "final_payment_received",
      label: "Отримання остаточного розрахунку",
      field: "is_final_payment_received",
    },
    {
      id: "team_paid",
      label: "Виплата зарплати бригаді",
      field: "is_team_paid",
    },
  ];

  const handleStageChange = async (
    field: keyof StageStatus,
    value: boolean
  ) => {
    if (!token) return;

    setStageStatus((prev) => ({ ...prev, [field]: value }));
    setLoadingField(field);

    try {
      await updateProjectStage(report.project.id, { [field]: value }, token);
    } catch (error) {
      console.error("Error updating stages:", error);
      setStageStatus((prev) => ({ ...prev, [field]: !value }));
    } finally {
      setLoadingField(null);
    }
  };

  const stagesList = ProjectStagesData.map((stage) => {
    const isActive = Boolean(stageStatus[stage.field]);
    const isLoading = loadingField === stage.field;

    return (
      <button
        key={stage.id}
        className={styles.stageItem}
        style={{
          backgroundColor: isActive
            ? STAGE_COLORS.active
            : STAGE_COLORS.inactive,
          opacity: isLoading ? 0.5 : 1,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
        disabled={isLoading}
        onClick={() => handleStageChange(stage.field, !isActive)}
      >
        <input
          type="checkbox"
          checked={isActive}
          readOnly
          className="mr-2 cursor-pointer"
        />
        {stage.label}
      </button>
    );
  });

  return <div className={styles.projectStages}>{stagesList}</div>;
};
