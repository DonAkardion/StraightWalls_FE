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
    if (crewId === null) return;
    const updated = { ...formData, team_id: crewId };
    setFormData(updated);
    onChange(updated);
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
      <input
        type="text"
        name="start_date"
        placeholder="01.21.2026"
        value={formData.start_date || ""}
        onChange={handleInputChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />

      <div className={styles.ModalInputTytle}>Дата завершення терміну</div>
      <input
        type="text"
        name="end_date"
        placeholder="09.28.2026"
        value={formData.end_date || ""}
        onChange={handleInputChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />
    </div>
  );
}
