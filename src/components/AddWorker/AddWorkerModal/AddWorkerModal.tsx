"use client";

import { useState } from "react";
import styles from "./AddWorkerModal.module.css";
import { X } from "lucide-react";

interface AddWorkerModalProps {
  onClose: () => void;
  onSubmit: (worker: {
    id: string;
    name: string;
    occupation: string;
    salary: string;
    phone: string;
  }) => void;
}

export const AddWorkerModal = ({ onClose, onSubmit }: AddWorkerModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        occupation: "",
        salary: "",
        phone: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev, [e.target.name]: e.target.value
      }))
    }

    const handleAdd = () => {
      const isAllFilled = Object.values(formData).every((val) => val.trim() !== "")
      if(!isAllFilled) {
        alert("Please, fill all the gaps")
        return
      } else {
          onSubmit({
            id: Date.now().toString(),
            ...formData
          })
      }
      onClose();
      console.log(formData)
    }

  return (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modalContent} ${styles.addCrewForm}`}>
      <label className="text-xl mb-10 text-black">
        Новий робітник
      </label>

      <div className="space-y-3 mb-5">
        <label>
          <div className={styles.addCrewInputTitle}>ПІБ виконавця</div>
          <input
            type="text"
            name="name"
            placeholder="ПІБ виконавця"
            value={formData.name}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none w-full"
          />
        </label>

        <label>
          <div className={styles.addCrewInputTitle}>Посада</div>
          <input
            type="text"
            name="occupation"
            placeholder="Посада"
            value={formData.occupation}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none w-full"
          />
        </label>

        <label>
          <div className={styles.addCrewInputTitle}>Зарплата</div>
          <input
            type="text"
            name="salary"
            placeholder="Зарплата"
            value={formData.salary}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none w-full"
          />
        </label>

        <label>
          <div className={styles.addCrewInputTitle}>Контакти</div>
          <input
            type="text"
            name="phone"
            placeholder="Контакти"
            value={formData.phone}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none w-full"
          />
        </label>
      </div>

      <div className="flex justify-end gap-5">
        <button
        onClick={onClose}
        className={`${styles.addCrewCancelBtn} rounded`}
      >
        Скасувати
      </button>
      <button
        onClick={handleAdd}
        className={`${styles.addCrewButton} rounded`}
      >
        Додати
      </button>
      </div>
    </div>
  </div>
);

};
