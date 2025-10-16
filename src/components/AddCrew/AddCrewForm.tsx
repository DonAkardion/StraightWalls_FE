"use client";

import React, { useState } from "react";
import styles from "./AddCrew.module.css";
import { useRouter } from "next/navigation";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { useCrew } from "@/features/addWorker/addWorkerContext";
import { handleAddCrew } from "@/api/crews";
import { handleAddWorker, handleUpdateWorker } from "@/api/workers";
import AddWorkerForm from "./AddWorkerForm/AddWorkerForm";
import ExistingWorkersSelect from "./ExistingWorkersSelect/ExistingWorkersSelect";

export default function AddCrewForm() {
  const { addCrew } = useCrew();
  const router = useRouter();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [crewWorkers, setCrewWorkers] = useState<Worker[]>([]);
  const [inputs, setInputs] = useState<Worker>({
    id: 0,
    full_name: "",
    position: "",
    phone_number: "",
    team_id: null,
  });
  const [selectedExistingWorkers, setSelectedExistingWorkers] = useState<
    Worker[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Немає токена авторизації");
        return;
      }
      const newCrew: Crew = await handleAddCrew(
        { name, status: "available" },
        token
      );

      addCrew(newCrew);

      if (crewWorkers.length > 0) {
        for (const worker of crewWorkers) {
          await handleAddWorker({ ...worker, team_id: newCrew.id }, token);
        }
      } else {
        if (
          inputs.full_name.trim() &&
          inputs.position.trim() &&
          inputs.phone_number.trim()
        ) {
          await handleAddWorker({ ...inputs, team_id: newCrew.id }, token);
        }
      }

      if (selectedExistingWorkers.length > 0) {
        for (const worker of selectedExistingWorkers) {
          await handleUpdateWorker(worker.id, token, { team_id: newCrew.id });
        }
      }
      router.back();
    } catch (error) {
      console.error("Помилка додавання бригади або робітників:", error);
      alert("Не вдалося додати бригаду або робітників");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-[1126px] m-auto pt-[30px] px-4 sm:px-6 md:pt-[65px] md:pl-[81px] md:pr-[59px] mb-20">
      <h2 className="md:text-[28px] mb-4">Додати бригаду</h2>
      <form
        onSubmit={handleSubmit}
        className={`${styles.addCrewForm} bg-white rounded-md p-5 md:p-6`}
      >
        <div className="grid md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
          <label className="text-[20px] text-black">Назва бригади</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть назву"
            className={`${styles.addCrewInput} h-10 md:h-11 rounded border border-black px-5 text-[16px]`}
          />
        </div>

        <AddWorkerForm
          inputForm={inputs}
          setInputForm={setInputs}
          crewWorkers={crewWorkers}
          setCrewWorkers={setCrewWorkers}
        />

        <ExistingWorkersSelect
          selectedWorkers={selectedExistingWorkers}
          setSelectedWorkers={setSelectedExistingWorkers}
        />
        <div className="mt-10">
          <button
            type="submit"
            disabled={loading}
            className={`${styles.addCrewButton} cursor-pointer w-full h-12 md:h-[54px] rounded-md text-[18px] text-black transition`}
          >
            {loading ? "Збереження..." : "Створити"}
          </button>
        </div>
      </form>
    </section>
  );
}
