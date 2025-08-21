import React from "react";
import { Worker } from "@/types/worker";
import { useState } from "react";
import styles from "./WorkerFormModal.module.css";

interface WorkerFormModalProps {
  initialData?: Worker;
  onSubmit: (data: Worker) => void;
  onClose: () => void;
}

export function WorkerFormModal({ initialData }: WorkerFormModalProps) {
  const [formData, setFormData] = useState<Worker>(
    initialData || {
      id: 1, // change later
      name: "",
      occupation: "",
      phone: "",
      salary: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      <div className={`${styles.ModalInputTytle}`}>Ім&apos;я</div>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="ПІБ"
        className="border-b-1 p-2 pb-1 outline-none"
      />
      <div className={`${styles.ModalInputTytle}`}>Посада</div>
      <input
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
        placeholder="Посада"
        className="border-b-1 p-2 pb-1 outline-none"
      />
      <div className={`${styles.ModalInputTytle}`}>Контакти</div>
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Телефон"
        className="border-b-1 p-2 pb-1 outline-none"
      />
      <div className={`${styles.ModalInputTytle}`}>Зарплата</div>
      <input
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        placeholder="Зарплата"
        className="border-b-1 p-2 pb-1 outline-none"
      />
    </div>
  );
}
