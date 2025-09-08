"use client";

import React, { useEffect, useState } from "react";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { FormModal } from "@/components/Table/Form/FormModal";
import { CrewWorkersList } from "@/components/Workers/CrewFormModal/CrewWorkers/CrewWorkersList";
import { CrewWorkersFormModal } from "@/components/Workers/CrewFormModal/CrewWorkers/CrewWorkersFormModal";
import { handleAddWorker, handleDeleteWorker } from "@/api/workers";
import { useUser } from "@/context/UserContextProvider";

interface CrewFormModalProps {
  initialData?: Crew;
  onChange: (data: Crew) => void;
  workers: Worker[];
  onWorkersUpdate: (updated: Worker[]) => void;
}

export function CrewFormModal({
  initialData,
  onChange,
  workers,
  onWorkersUpdate,
}: CrewFormModalProps) {
  const [formData, setFormData] = useState<Crew>(
    initialData ?? { id: 0, name: "", status: "" }
  );

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [newWorker, setNewWorker] = useState<Worker | null>(null);

  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [user]);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const crewWorkers = workers.filter((w) => w.team_id === formData.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
  };

  const handleAddWorkerToCrew = async () => {
    if (!token || !newWorker) return;

    try {
      const { worker: created } = await handleAddWorker(
        {
          full_name: newWorker.full_name,
          phone_number: newWorker.phone_number ?? "",
          position: newWorker.position,
          team_id: formData.id,
        },
        token
      );

      onWorkersUpdate([...workers, created]);
      setNewWorker(null);
      setShowWorkerModal(false);
    } catch (error) {
      console.error("Помилка при додаванні робітника:", error);
    }
  };

  const handleDeleteWorkerFromCrew = async (id: number) => {
    if (!token) return;
    try {
      await handleDeleteWorker(id, token);
      onWorkersUpdate(workers.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Помилка при видаленні робітника:", error);
    }
  };

  return (
    <>
      <label className="block mb-3">
        <div className="ml-2">Назва бригади</div>
        <input
          type="text"
          name="name"
          placeholder="Назва"
          value={formData.name}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 pl-3 outline-none w-full"
        />
      </label>

      <div className="mt-3">
        <h6 className="mb-2 ml-2">Робітники бригади</h6>
        <CrewWorkersList
          workers={crewWorkers}
          onAdd={() => setShowWorkerModal(true)}
          onDelete={handleDeleteWorkerFromCrew}
        />
      </div>

      {showWorkerModal && (
        <FormModal
          title="Додати робітника"
          onClose={() => setShowWorkerModal(false)}
          onSave={handleAddWorkerToCrew}
          isValid={Boolean(newWorker?.full_name && newWorker?.position)}
        >
          <CrewWorkersFormModal
            worker={undefined}
            onChange={(data) => setNewWorker(data)}
          />
        </FormModal>
      )}
    </>
  );
}
