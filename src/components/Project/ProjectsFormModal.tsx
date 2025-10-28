"use client";
import styles from "./ProjectsFormModal.module.css";
import { Project } from "@/types/project";
import { Client } from "@/types/client";
import { Crew } from "@/types/crew";
import React, { useEffect, useState } from "react";
import { getClients } from "@/api/clients";
import { getCrews } from "@/api/crews";
import { useUser } from "@/context/UserContextProvider";
import { CrewSelector } from "@/components/Project/EditComponents/CrewSelector";
import { ClientSelector } from "@/components/Project/EditComponents/ClientSelector";

interface PaymentCalendarProps {
  value: string;
  onChange: (val: string) => void;
  min?: string;
  max?: string;
}

const PaymentCalendar: React.FC<PaymentCalendarProps> = ({
  value,
  onChange,
  min,
  max,
}) => {
  const [selectedDate, setSelectedDate] = useState(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  return (
    <input
      type="date"
      value={selectedDate}
      min={min}
      max={max}
      onChange={(e) => {
        setSelectedDate(e.target.value);
        onChange(e.target.value);
      }}
      className="border-b-1 p-2 pb-1 outline-none w-full cursor-pointer"
    />
  );
};

interface ProjectsFormModalProps {
  project: Project;
  onChange: (updated: Project) => void;
}

export function ProjectsFormModal({
  project,
  onChange,
}: ProjectsFormModalProps) {
  const { token } = useUser();
  const [formData, setFormData] = useState<Project>(project);
  const [clients, setClients] = useState<Client[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);

  useEffect(() => {
    setFormData(project);
  }, [project]);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [clientsRes, crewsRes] = await Promise.all([
          getClients(token),
          getCrews(token),
        ]);
        setClients(clientsRes);
        setCrews(crewsRes);
      } catch (e) {
        console.error("Помилка при отриманні клієнтів/бригад:", e);
      }
    };
    fetchData();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleClientChange = (clientId: number | null) => {
    if (clientId === null) return;
    const updated = { ...formData, client_id: clientId };
    setFormData(updated);
    onChange(updated);
  };

  const handleCrewChange = (crewId: number | null) => {
    let updated: Partial<Project> = { ...formData };

    if (crewId) {
      updated.team_id = crewId;
    } else {
      const { team_id, ...rest } = updated;
      updated = rest;
    }
    setFormData(updated as Project);
    onChange(updated as Project);
  };

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      <div className={styles.ModalInputTytle}>Назва проєкту</div>
      <input
        type="text"
        name="name"
        placeholder="Назва проєкту"
        value={formData.name}
        onChange={handleInputChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />

      <div className={styles.ModalInputTytle}>Оберіть клієнта</div>
      <ClientSelector
        clients={clients}
        value={formData.client_id ?? null}
        onChange={handleClientChange}
      />

      <div className={styles.ModalInputTytle}>Оберіть бригаду</div>
      <CrewSelector
        crews={crews}
        value={formData.team_id ?? null}
        onChange={handleCrewChange}
      />

      <div className={styles.ModalInputTytle}>Дата початку терміну</div>
      <PaymentCalendar
        value={formData.start_date || ""}
        onChange={(val) => {
          const updated = { ...formData, start_date: val };
          setFormData(updated);
          onChange(updated);
        }}
      />

      <div className={styles.ModalInputTytle}>Дата завершення терміну</div>
      <PaymentCalendar
        value={formData.end_date || ""}
        onChange={(val) => {
          const updated = { ...formData, end_date: val };
          setFormData(updated);
          onChange(updated);
        }}
        min={formData.start_date || ""}
      />
    </div>
  );
}
