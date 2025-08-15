"use client";
import styles from "./ProjectsFormModal.module.css";
import { Project } from "@/types/project";
import { Client } from "@/types/client";
import { Crew } from "@/types/crew";
import React, { useEffect, useState } from "react";

interface ProjectsFormModalProps {
  project: Project;
  clients: Client[];
  crews: Crew[];
  onChange: (updated: Project) => void;
}

export function ProjectsFormModal({
  project,
  clients,
  crews,
  onChange,
}: ProjectsFormModalProps) {
  const [formData, setFormData] = useState<Project>(project);

  useEffect(() => {
    setFormData(project);
  }, [project]);

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
      <div className={`${styles.ModalInputTytle}`}>Назва проєкту</div>
      <input
        type="text"
        name="name"
        placeholder="Назва проєкту"
        value={formData.name}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />
      <div className={`${styles.ModalInputTytle}`}>Оберіть клієнта</div>
      <select
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        className="appearance-none border-b-1 p-2 pb-1 outline-none"
      >
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <div className={`${styles.ModalInputTytle}`}>Оберіть бригаду</div>
      <select
        name="crewId"
        value={formData.crewId}
        onChange={handleChange}
        className="appearance-none border-b-1 p-2 pb-1 outline-none"
      >
        {crews.map((crew) => (
          <option key={crew.id} value={crew.id}>
            {crew.name}
          </option>
        ))}
      </select>
      <div className={`${styles.ModalInputTytle}`}>Дата початку терміну</div>
      <input
        type="text"
        name="startDate"
        placeholder="Дата початку (напр. 01.09.2025)"
        value={formData.startDate}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />
      <div className={`${styles.ModalInputTytle}`}>Дата завершення терміну</div>
      <input
        type="text"
        name="endDate"
        placeholder="Дата завершення (напр. 10.09.2025)"
        value={formData.endDate}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />
      <div className={`${styles.ModalInputTytle}`}>Статус проєкту</div>
      <input
        type="text"
        name="status"
        placeholder="Статус"
        value={formData.status ?? ""}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />
    </div>
  );
}
