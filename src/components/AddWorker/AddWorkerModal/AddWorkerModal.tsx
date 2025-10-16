"use client";

import { useEffect, useState } from "react";
import styles from "./AddWorkerModal.module.css";
import { useUser } from "@/context/UserContextProvider";
import { Worker } from "@/types/worker";
import { Crew } from "@/types/crew";
import { getCrews } from "@/api/crews";
import { CrewSelector } from "@/components/Project/EditComponents/CrewSelector";

interface AddWorkerModalProps {
  onClose: () => void;
  onAdd: (worker: Worker) => void;
}

export const AddWorkerModal = ({ onClose, onAdd }: AddWorkerModalProps) => {
  const { token } = useUser();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [formData, setFormData] = useState<{
    full_name: string;
    position: string;
    phone_number: string;
    team_id: number | null;
  }>({
    full_name: "",
    position: "",
    phone_number: "",
    team_id: null,
  });

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        const data = await getCrews(token!);
        setCrews(data);
      } catch (error) {
        console.log("Crew isn't gotten:", error);
      }
    };
    fetchCrews();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === "team_id" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleAdd = async () => {
    const requiredFields = ["full_name", "position", "phone_number"];
    const isAllFilled = requiredFields.every(
      (key) => String(formData[key as keyof typeof formData]).trim() !== ""
    );

    if (!isAllFilled) {
      alert("Будь ласка, заповніть усі обов’язкові поля");
      return;
    }

    if (!token) {
      alert("Token not found");
      return;
    }

    try {
      onAdd(formData as Worker);
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
            <div className={styles.addCrewInputTitle}>Бригада</div>
            <CrewSelector
              crews={crews}
              value={formData.team_id}
              onChange={(crewId) =>
                setFormData((prev) => ({
                  ...prev,
                  team_id: crewId,
                }))
              }
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
