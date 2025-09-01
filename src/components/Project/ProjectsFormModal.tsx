"use client";
import styles from "./ProjectsFormModal.module.css";
import { Project } from "@/types/project";
import { Client } from "@/types/client";
import { Crew } from "@/types/crew";
import React, { useEffect, useState } from "react";
import { getClients } from "@/api/clients";
import { getCrews } from "@/api/crews";
import { useUser } from "@/context/UserContextProvider";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
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
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />

      <div className={styles.ModalInputTytle}>Оберіть клієнта</div>
      <select
        name="client_id"
        value={formData.client_id || ""}
        onChange={handleChange}
        className="appearance-none border-b-1 p-2 pb-1 outline-none"
      >
        <option value="">— Виберіть клієнта —</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.full_name}
          </option>
        ))}
      </select>

      <div className={styles.ModalInputTytle}>Оберіть бригаду</div>
      <select
        name="team_id"
        value={formData.team_id || ""}
        onChange={handleChange}
        className="appearance-none border-b-1 p-2 pb-1 outline-none"
      >
        <option value="">— Виберіть бригаду —</option>
        {crews.map((crew) => (
          <option key={crew.id} value={crew.id}>
            {crew.name}
          </option>
        ))}
      </select>

      <div className={styles.ModalInputTytle}>Дата початку терміну</div>
      <input
        type="text"
        name="start_date"
        placeholder="01.09.2025"
        value={formData.start_date || ""}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />

      <div className={styles.ModalInputTytle}>Дата завершення терміну</div>
      <input
        type="text"
        name="end_date"
        placeholder="10.09.2025"
        value={formData.end_date || ""}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />
    </div>
  );
}
