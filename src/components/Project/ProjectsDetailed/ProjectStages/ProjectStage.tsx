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
    is_thinking: report.project.is_thinking,
    is_confirmed: report.project.is_confirmed,
    is_rejected: report.project.is_rejected,
    is_scheduled: report.project.is_scheduled,
    is_keys_and_advance: report.project.is_keys_and_advance,
    is_order_materials: report.project.is_order_materials,
    is_in_progress: report.project.is_in_progress,
    is_completed: report.project.is_completed,
    is_all_calculated: report.project.is_all_calculated,
  });

  const ProjectStagesData: ProjectStage[] = [
    { id: "thinking", label: "Думає", field: "is_thinking" },
    { id: "confirmed", label: "Підтвердив", field: "is_confirmed" },
    { id: "rejected", label: "Відмовив", field: "is_rejected" },
    { id: "scheduled", label: "Поставити в графік", field: "is_scheduled" },
    { id: "keys", label: "Ключі і аванс", field: "is_keys_and_advance" },
    {
      id: "materials",
      label: "Замовити матеріал",
      field: "is_order_materials",
    },
    { id: "in_progress", label: "В роботі", field: "is_in_progress" },
    { id: "completed", label: "Здати", field: "is_completed" },
    { id: "calculated", label: "Всі розраховані", field: "is_all_calculated" },
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
