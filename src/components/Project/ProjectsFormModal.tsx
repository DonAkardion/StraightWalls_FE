"use client";

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
    <div className="p-4 flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Назва проєкту"
        value={formData.name}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />

      <select
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      >
        <option value="">Оберіть клієнта</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <select
        name="crewId"
        value={formData.crewId}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      >
        <option value="">Оберіть бригаду</option>
        {crews.map((crew) => (
          <option key={crew.id} value={crew.id}>
            {crew.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="startDate"
        placeholder="Дата початку (напр. 01.09.2025)"
        value={formData.startDate}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />

      <input
        type="text"
        name="endDate"
        placeholder="Дата завершення (напр. 10.09.2025)"
        value={formData.endDate}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />

      <input
        type="text"
        name="status"
        placeholder="Статус"
        value={formData.status ?? ""}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
