"use client";
import React from "react";
import styles from "./Projects.module.css";
import { mockProjects } from "@/mock/Project/mockProjects";
import { Project } from "@/types/project";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AllProjectsList } from "@/components/Projects/AllProjectsList";
import { useParams } from "next/navigation";
import { AllProjectsList } from "@/components/Project/AllProjectsList";
import { Calendar } from "@/components/Calendar/Calendar";
import { Crew } from "@/types/crew";
import { mockCrews } from "@/mock/Crew/crewMock";
import { Client } from "@/types/client";
import { mockClients } from "@/mock/Clients/clientsMock";
import { ProjectsFormModal } from "@/components/Project/ProjectsFormModal";
import { FormModal } from "@/components/Table/Form/FormModal";

export function Projects() {
  const { role } = useParams();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [crews] = useState<Crew[]>(mockCrews);
  const [clients] = useState<Client[]>(mockClients);
  const [modalData, setModalData] = useState<Project | null>(null);
  const [currentForm, setCurrentForm] = useState<Project | null>(null);

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[46px] pl-[20px] pb-[35px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[60px] md:pb-[50px]`}
    >
      <AllProjectsList
        projects={projects}
        crews={crews}
        clients={clients}
        onDelete={(id) =>
          setProjects((prev) => prev.filter((p) => p.id !== id))
        }
        onEdit={(updated) =>
          setProjects((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          )
        }
        onAdd={() => {}}
        role={Array.isArray(role) ? role[0] : role}
      />

      <div>Calendar</div>
        onEdit={(updated) => {
          setModalData(updated);
          setCurrentForm(updated);
        }}
        onAdd={() => {}}
        role={Array.isArray(role) ? role[0] : role}
      {/* Переробити під реальні дані */}
      <Calendar />
      {currentForm && modalData && (
        <FormModal
          title="Редагувати проєкт"
          onClose={() => {
            setModalData(null);
            setCurrentForm(null);
          }}
          onSave={() => {
            setProjects((prev) =>
              prev.map((p) => (p.id === currentForm.id ? currentForm : p))
            );
            setModalData(null);
            setCurrentForm(null);
          }}
          isValid={
            !!currentForm.name && !!currentForm.clientId && !!currentForm.crewId
          }
        >
          <ProjectsFormModal
            project={modalData}
            clients={clients}
            crews={crews}
            onChange={(updated) => setCurrentForm(updated)}
          />
        </FormModal>
      )}
    </section>
  );
}
