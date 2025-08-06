import { Worker } from "@/types/worker";
import { useState } from "react";

interface WorkerFormModalProps {
  initialData?: Worker;
  onSubmit: (data: Worker) => void;
  onClose: () => void;
}

export function WorkerFormModal({
  initialData,
  onSubmit,
  onClose,
}: WorkerFormModalProps) {
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

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="ПІБ"
      />
      <input
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
        placeholder="Посада"
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Телефон"
      />
      <input
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        placeholder="Зарплата"
      />
      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={onClose}>Скасувати</button>
    </div>
  );
}
