"use client";
import styles from "./Workers.module.css";
import { useState, useEffect } from "react";
import { mockWorkers } from "@/mock/Workers/workersMock";
import { mockCrews } from "@/mock/Crew/crewMock";
import { WorkersInfo } from "@/components/Workers/WorkersInfo";
import { WorkersCrewTable } from "@/components/Workers/WorkersCrewTable";
import { WorkersTable } from "@/components/Workers/WorkersTable";
import { Worker } from "@/types/worker";
import { Crew } from "@/types/crew";

export function Workers() {
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [crews, setCrews] = useState<Crew[]>(mockCrews);

  type WithId = { id: string };

  function handleDelete<T extends WithId>(
    id: string,
    setState: React.Dispatch<React.SetStateAction<T[]>>
  ) {
    setState((prev) => prev.filter((item) => item.id !== id));
  }

  const [modalData, setModalData] = useState<{
    crew?: Crew;
    worker?: Worker;
  } | null>(null);

  const deleteCrew = (id: string) => handleDelete(id, setCrews);
  const deleteWorker = (id: string) => handleDelete(id, setWorkers);

  const openEditModal = (crew: Crew) => {
    setModalData({ crew });
  };

  const openAddModal = () => {
    setModalData({});
  };

  return (
    <section
      className={`${styles.workers} max-w-[1126px] m-auto pt-[40px] pl-[20px] pb-[36px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[84px] md:pb-[68px]`}
    >
      <WorkersInfo />
      <WorkersCrewTable
        crews={crews}
        onDelete={deleteCrew}
        onEdit={openEditModal}
        onAdd={() => openAddModal()}
      />
      <WorkersTable />
      {/* календар */}
    </section>
  );
}
