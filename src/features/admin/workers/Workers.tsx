"use client";
import React from "react";
import styles from "./Workers.module.css";
import { useState } from "react";
import { mockWorkers } from "@/mock/Workers/workersMock";
import { mockCrews } from "@/mock/Crew/crewMock";
import { WorkersInfo } from "@/components/Workers/WorkersInfo";
import { WorkersCrewTable } from "@/components/Workers/WorkersCrewTable";
import { WorkersTable } from "@/components/Workers/WorkersTable";
import { Worker } from "@/types/worker";
import { Crew } from "@/types/crew";
import { FormModal } from "@/components/Table/Form/FormModal";
import { CrewFormModal } from "@/components/Workers/CrewFormModal/CrewFormModal";
import { WorkerFormModal } from "@/components/Workers/WorkerFormModal/WorkerFormModal";
import { handleDelete, handleSave } from "@/utils/dataHandlers";
import Calendar from "../../../components/Calendar/Calendar";
import { AddWorkerModal } from "@/components/AddWorker/AddWorkerModal/AddWorkerModal";

export function Workers() {
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [crews, setCrews] = useState<Crew[]>(mockCrews);

  const [modalData, setModalData] = useState<{
    crew?: Crew;
    worker?: Worker;
  } | null>(null);

  // операції над Crew

  const deleteCrew = (id: string) => setCrews((prev) => handleDelete(prev, id));

  const saveCrew = (crew: Crew) => setCrews((prev) => handleSave(prev, crew));

  const openEditModal = (crew: Crew) => setModalData({ crew });
  const openAddModal = () => setModalData({});

  const closeModal = () => setModalData(null);

  //операції над Worker

  const deleteWorker = (id: string) =>
    setWorkers((prev) => handleDelete(prev, id));

  const saveWorker = (worker: Worker) =>
    setWorkers((prev) => handleSave(prev, worker));

  const openEditWorkerModal = (worker: Worker) => setModalData({ worker });

  const openAddWorkerModal = () => setModalData({});

  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleAddWorker = (newWorker: Worker) => {
    setWorkers((prev) => [...prev, newWorker]);
    setIsModalOpen(false)
  }

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
          onSave={() => {}}
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
          title={modalData.worker ? "Редагувати робітника" : "Додати робітника"}
          onClose={closeModal}
          onSave={() => {}}
        >
          <WorkerFormModal
            initialData={modalData.worker}
            onSubmit={saveWorker}
            onClose={closeModal}
          />
        </FormModal>
      )}
      {isModalOpen && (
              <AddWorkerModal
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddWorker}
              />
            )}

      <Calendar />
    </section>
  );
}
