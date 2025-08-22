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
import { handleUpdateWorker, handleAddWorker, handleDeleteWorker } from "@/api/crews";
import { useUser } from "@/context/UserContextProvider";
import { fetcher } from "@/utils/fetcher";

export function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [crews, setCrews] = useState<Crew[]>([]);
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  const [modalData, setModalData] = useState<{ crew?: Crew; worker?: Worker } | null>(null);
  const [formData, setFormData] = useState<Worker>({
    id: 0,
    full_name: "",
    position: "",
    phone_number: "",
    team_id: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [user]);

  useEffect(() => {
    const getWorkers = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetcher<{ data: Worker[] }>(
          "https://api.rivni-stiny.click/api/workers",
          { token }
        );
        setWorkers(response.data);
      } catch (error) {
        console.error("Помилка завантаження воркерів:", error);
      } finally {
        setLoading(false);
      }
    };

    getWorkers();
  }, [token]);

  const deleteCrew = (id: number) => setCrews((prev) => handleDelete(prev, id));
  const saveCrew = (crew: Crew) => setCrews((prev) => handleSave(prev, crew));
  const openEditModal = (crew: Crew) => setModalData({ crew });
  const openAddModal = () => setModalData({});
  const closeModal = () => {
    setModalData(null);
    setFormData({
      id: 0,
      full_name: "",
      position: "",
      phone_number: "",
      team_id: 1,
    });
  };

  const deleteWorker = async (id: number) => {
    try {
      await handleDeleteWorker(id, token!)
      setWorkers((prev) => handleDelete(prev, id))
    } catch (error) {
      console.log("Error:", error)
    }
  } 

  const openEditWorkerModal = (worker: Worker) => {
    setFormData(worker);
    setModalData({ worker });
  };

  const handleSaveWorker = async (updatedWorker: Worker) => {
    if (!token) return;
    try {
      const updated = await handleUpdateWorker(updatedWorker.id, token, updatedWorker);
      setWorkers((prev) => handleSave(prev, updated));
      closeModal();
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const handleAddNewWorker = async (worker: Worker) => {
    if (!token) return;
    try {
      const { worker: newWorker } = await handleAddWorker(worker, token);
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
      <WorkersInfo />
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
          title={modalData.crew ? "Редагувати бригаду" : "Додати бригаду"}
          onClose={closeModal}
          onSave={() => saveCrew(formData as unknown as Crew)}
        >
          <CrewFormModal
            initialData={modalData.crew}
            onSubmit={saveCrew}
            onClose={closeModal}
            workers={workers}
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
