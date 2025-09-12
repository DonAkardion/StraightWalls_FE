export interface ProjectStage {
  id: string;
  label: string;
  field: keyof StageStatus;
}

export interface StageStatus {
  is_thinking?: boolean;
  is_confirmed?: boolean;
  is_rejected?: boolean;
  is_scheduled?: boolean;
  is_keys_and_advance?: boolean;
  is_order_materials?: boolean;
  is_in_progress?: boolean;
  is_completed?: boolean;
  is_all_calculated?: boolean;
}
