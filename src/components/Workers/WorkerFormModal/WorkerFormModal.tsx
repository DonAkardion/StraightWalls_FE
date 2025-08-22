import React from "react";
import { Worker } from "@/types/worker";
import styles from "./WorkerFormModal.module.css";

interface WorkerFormModalProps {
  formData: Worker;
  setFormData: React.Dispatch<React.SetStateAction<Worker>>;
}

export function WorkerFormModal({ formData, setFormData }: WorkerFormModalProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      <div className={styles.ModalInputTytle}>Ім&apos;я</div>
      <input
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="ПІБ"
        className="border-b-1 p-2 pb-1 outline-none"
      />

      <div className={styles.ModalInputTytle}>Посада</div>
      <input
        name="position"
        value={formData.position}
        onChange={handleChange}
        placeholder="Посада"
        className="border-b-1 p-2 pb-1 outline-none"
      />

      <div className={styles.ModalInputTytle}>Контакти</div>
      <input
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="Телефон"
        className="border-b-1 p-2 pb-1 outline-none"
      />
    </div>
  );
}
