"use client";

import React, { useEffect, useState } from "react";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { FormModal } from "@/components/Table/Form/FormModal";
import { CrewWorkersList } from "@/components/Workers/CrewFormModal/CrewWorkers/CrewWorkersList";
import { CrewWorkersFormModal } from "@/components/Workers/CrewFormModal/CrewWorkers/CrewWorkersFormModal";
import { handleAddWorker, handleUpdateWorker } from "@/api/workers";
import { useUser } from "@/context/UserContextProvider";
import ExistingWorkersSelect from "@/components/AddCrew/ExistingWorkersSelect/ExistingWorkersSelect";

interface CrewFormModalProps {
  initialData?: Crew;
  onChange: (data: Crew) => void;
  workers: Worker[];
  onWorkersUpdate: (updated: Worker[]) => void;
  selectedExistingWorkers: Worker[];
  setSelectedExistingWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
}

export function CrewFormModal({
  initialData,
  onChange,
  workers,
  onWorkersUpdate,
  selectedExistingWorkers,
  setSelectedExistingWorkers,
}: CrewFormModalProps) {
  const [formData, setFormData] = useState<Crew>(
    initialData ?? { id: 0, name: "", status: "" }
  );

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [newWorker, setNewWorker] = useState<Worker | null>(null);

  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"current" | "existing">("current");

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
      // await handleDeleteWorker(id, token);
      // onWorkersUpdate(workers.filter((w) => w.id !== id));
      const updatedWorker = await handleUpdateWorker(id, token, {
        team_id: null,
      });
      const updatedWorkers = workers.map((w) =>
        w.id === id ? { ...w, team_id: null } : w
      );
      onWorkersUpdate(updatedWorkers);
    } catch (error) {
      console.error("Помилка при відкріпленні робітника:", error);
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
        <div className="flex gap-3 mb-4 ml-2">
          <button
            type="button"
            onClick={() => setActiveTab("current")}
            className={`px-4 py-1 rounded border-2  transition-colors ${
              activeTab === "current"
                ? " text-black  border-green-400"
                : "bg-white text-gray-700 hover:border-blue-400 hover:text-blue-400 border-gray-400"
            }`}
          >
            Поточні
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("existing")}
            className={`px-4 py-1 rounded border-2  transition-colors ${
              activeTab === "existing"
                ? " text-black  border-green-400"
                : "bg-white text-gray-700 hover:border-blue-400 hover:text-blue-400 border-gray-400"
            }`}
          >
            Додати існуючих
          </button>
        </div>
        {activeTab === "current" && (
          <>
            <CrewWorkersList
              workers={crewWorkers}
              onAdd={() => setShowWorkerModal(true)}
              onDelete={handleDeleteWorkerFromCrew}
            />
          </>
        )}
        {activeTab === "existing" && (
          <div className="">
            <ExistingWorkersSelect
              selectedWorkers={selectedExistingWorkers}
              setSelectedWorkers={setSelectedExistingWorkers}
            />
          </div>
        )}
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
