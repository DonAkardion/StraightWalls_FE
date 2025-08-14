import React from "react";
import { Worker } from "@/types/worker";
import { useState } from "react";

interface WorkerFormModalProps {
  initialData?: Worker;
  onSubmit: (data: Worker) => void;
  onClose: () => void;
}

export function WorkerFormModal({ initialData }: WorkerFormModalProps) {
  const [formData, setFormData] = useState<Worker>(
    initialData || {
      id: crypto.randomUUID(),
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
    <div className="p-4 flex flex-col gap-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="ПІБ"
        className="border rounded px-2 py-1"
      />
      <input
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
        placeholder="Посада"
        className="border rounded px-2 py-1"
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Телефон"
        className="border rounded px-2 py-1"
      />
      <input
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        placeholder="Зарплата"
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
