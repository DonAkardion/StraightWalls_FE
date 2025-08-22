"use client";

import { useEffect, useState } from "react";
import styles from "./AddWorkerModal.module.css";
import { handleAddWorker } from "@/api/crews";
import { useUser } from "@/context/UserContextProvider";
import { Worker } from "@/types/worker";

interface AddWorkerModalProps {
  onClose: () => void;
  onAdd: (worker: Worker) => void;
}

export const AddWorkerModal = ({ onClose, onAdd }: AddWorkerModalProps) => {
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    position: "",
    phone_number: "",
    team_id: 1,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    const isAllFilled = Object.values(formData).every(
      (val) => val !== null && val !== undefined && String(val).trim() !== ""
    );
    if (!isAllFilled) {
      alert("Будь ласка, заповніть усі поля");
      return;
    }

    if (!token) {
      alert("Token not found");
      return;
    }

    try {
      const addedWorker = await handleAddWorker(formData, token);

      onAdd(addedWorker.worker);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Сталася невідома помилка");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.addCrewForm}`}>
        <label className="text-xl mb-10 text-black">Новий робітник</label>

        <div className="space-y-3 mb-5">
          <label>
            <div className={styles.addCrewInputTitle}>ПІБ виконавця</div>
            <input
              type="text"
              name="full_name"
              placeholder="ПІБ виконавця"
              value={formData.full_name}
              onChange={handleChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            />
          </label>

          <label>
            <div className={styles.addCrewInputTitle}>Посада</div>
            <input
              type="text"
              name="position"
              placeholder="Посада"
              value={formData.position}
              onChange={handleChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            />
          </label>

          <label>
            <div className={styles.addCrewInputTitle}>Контакти</div>
            <input
              type="text"
              name="phone_number"
              placeholder="Контакти"
              value={formData.phone_number}
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
