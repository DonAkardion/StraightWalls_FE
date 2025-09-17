export interface ProjectStage {
  id: string;
  label: string;
  field: keyof StageStatus;
}

export interface StageStatus {
  is_works_confirmed?: boolean;
  is_start_date_agreed?: boolean;
  is_team_assigned?: boolean;
  is_keys_received?: boolean;
  is_materials_prepaid?: boolean;
  is_materials_ordered?: boolean;
  is_team_started?: boolean;
  is_details_clarified?: boolean;
  is_work_accepted?: boolean;
  is_work_delivered?: boolean;
  is_final_payment_received?: boolean;
  is_team_paid?: boolean;
}
