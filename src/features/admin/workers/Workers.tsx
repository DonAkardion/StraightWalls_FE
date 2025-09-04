"use client";

import React, { useEffect, useState } from "react";
import styles from "./Workers.module.css";
import { WorkersInfo } from "@/components/Workers/WorkersInfo";
import { WorkersCrewTable } from "@/components/Workers/WorkersCrewTable";
import { WorkersTable } from "@/components/Workers/WorkersTable";
import { Worker } from "@/types/worker";
import { Crew } from "@/types/crew";
import { FormModal } from "@/components/Table/Form/FormModal";
import { CrewFormModal } from "@/components/Workers/CrewFormModal/CrewFormModal";
import { WorkerFormModal } from "@/components/Workers/WorkerFormModal/WorkerFormModal";
import Calendar from "@/components/Calendar/Calendar";
import { AddWorkerModal } from "@/components/AddWorker/AddWorkerModal/AddWorkerModal";
import { handleDelete, handleSave } from "@/utils/dataHandlers";
import {
  handleUpdateWorker,
  handleAddWorker,
  handleDeleteWorker,
} from "@/api/workers";
import { useUser } from "@/context/UserContextProvider";
import { fetcher } from "@/utils/fetcher";
import { getCrews, handleDeleteCrew, handleEditCrew } from "@/api/crews";

export function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [crews, setCrews] = useState<Crew[]>([]);
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  const [modalData, setModalData] = useState<{
    crew?: Crew;
    worker?: Worker;
  } | null>(null);
  const [formData, setFormData] = useState<Worker>({
    id: 0,
    full_name: "",
    position: "",
    phone_number: "",
    team_id: null,
  });
  const [crewFormData, setCrewFormData] = useState<Crew>({
    id: 0,
    name: "",
    status: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [user]);

  // get-запити для робітників та бригад
  useEffect(() => {
    const getWorkers = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetcher<{ data: Worker[] }>(
          "https://api.rivni-stiny.click/api/workers",
          { token }
        );
        setWorkers(Array.isArray(response) ? response : response.data);
      } catch (error) {
        console.error("Помилка завантаження воркерів:", error);
      } finally {
        setLoading(false);
      }
    };

    getWorkers();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchCrews = async () => {
      const data = await getCrews(token!);
      setCrews(data);
    };

    fetchCrews();
  }, [token]);

  // Crew
  const deleteCrew = async (id: number) => {
    if (!token) return;
    try {
      await handleDeleteCrew(id, token!);
      setCrews((prev) => handleDelete(prev, id));
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const handleSaveCrew = async () => {
    if (!token) return;
    try {
      const updatedCrew = await handleEditCrew(
        crewFormData.id,
        crewFormData,
        token
      );
      setCrews((prev) =>
        prev.map((c) => (c.id === updatedCrew.id ? updatedCrew : c))
      );
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (crew: Crew) => {
    setCrewFormData(crew);
    setModalData({ crew });
  };

  const openAddModal = () => {
    setCrewFormData({ id: 0, name: "", status: "" });
    setModalData({ crew: {} as Crew });
  };

  const closeModal = () => {
    setModalData(null);
    setFormData({
      id: 0,
      full_name: "",
      position: "",
      phone_number: "",
      team_id: null,
    });
  };

  // Worker
  const deleteWorker = async (id: number) => {
    try {
      await handleDeleteWorker(id, token!);
      setWorkers((prev) => handleDelete(prev, id));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const openEditWorkerModal = (worker: Worker) => {
    setFormData(worker);
    setModalData({ worker });
  };

  const handleSaveWorker = async (updatedWorker: Worker) => {
    if (!token) return;
    try {
      const updated = await handleUpdateWorker(updatedWorker.id, token, {
        ...updatedWorker,
        phone_number: updatedWorker.phone_number ?? "",
        team_id: updatedWorker.team_id,
      });
      setWorkers((prev) => handleSave(prev, updated));
      closeModal();
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const handleAddNewWorker = async (worker: Worker) => {
    if (!token) return;
    try {
      const { worker: newWorker } = await handleAddWorker(
        {
          ...worker,
          phone_number: worker.phone_number ?? "",
          team_id: worker.team_id,
        },
        token
      );

      setWorkers((prev) => [...prev, newWorker]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding worker:", error);
    }
  };

  return (
    <section
      className={`${styles.workers} max-w-[1126px] m-auto pt-[40px] pl-[20px] pb-[36px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[84px] md:pb-[68px]`}
    >
      <WorkersInfo crews={crews} workers={workers} />
      <WorkersCrewTable
        crews={crews}
        workers={workers}
        onDelete={deleteCrew}
        onEdit={openEditModal}
        onAdd={openAddModal}
      />

      <WorkersTable
        workers={workers}
        crews={crews}
        onDelete={deleteWorker}
        onEdit={openEditWorkerModal}
        onAdd={() => setIsModalOpen(true)}
      />
      {modalData?.crew && (
        <FormModal
          title={crewFormData ? "Редагувати бригаду" : "Додати бригаду"}
          onClose={closeModal}
          onSave={() => handleSaveCrew()}
        >
          <CrewFormModal
            initialData={crewFormData}
            onChange={(data) => setCrewFormData(data)}
            workers={workers}
            onWorkersUpdate={setWorkers}
          />
        </FormModal>
      )}
      {modalData?.worker && (
        <FormModal
          title="Редагувати робітника"
          onClose={closeModal}
          onSave={() => handleSaveWorker(formData)}
        >
          <WorkerFormModal formData={formData} setFormData={setFormData} />
        </FormModal>
      )}

      {isModalOpen && (
        <AddWorkerModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddNewWorker}
        />
      )}

      <Calendar />
    </section>
  );
}
