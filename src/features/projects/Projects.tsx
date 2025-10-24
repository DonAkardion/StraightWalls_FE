"use client";

import React, { useEffect, useState } from "react";
import styles from "./Projects.module.css";

import { useParams } from "next/navigation";

import { Project, ProjectResponse, ProjectStatus } from "@/types/project";

import { AllProjectsList } from "@/components/Project/AllProjectsList";
// import Calendar from "@/components/Calendar/Calendar";
import { CrewCalendar } from "@/components/CrewCalendar/CrewCalendar";
import { ProjectsFormModal } from "@/components/Project/ProjectsFormModal";
import { FormModal } from "@/components/Table/Form/FormModal";
import { useUser } from "@/context/UserContextProvider";
import { getProjects, deleteProject, patchProject } from "@/api/projects";

const mapProject = (p: ProjectResponse): Project => ({
  ...p,
  description: "",
  works: [],
  materials: [],
  payments: [],
  status: p.status as ProjectStatus,
});

export function Projects() {
  const { role } = useParams();
  const roleStr = Array.isArray(role) ? role[0] : role ?? "";

  const [projects, setProjects] = useState<Project[]>([]);

  const [modalData, setModalData] = useState<Project | null>(null);
  const [currentForm, setCurrentForm] = useState<Project | null>(null);

  const [loading, setLoading] = useState(true);
  const { token } = useUser();

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        console.error("No token, cannot fetch projects");
        setLoading(false);
        return;
      }
      try {
        const projectsResp = await getProjects(token);
        setProjects(projectsResp.map(mapProject));
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSaveProject = async () => {
    if (!token || !currentForm) return;
    try {
      const updatedResp = await patchProject(
        currentForm.id,
        currentForm,
        token
      );
      const updated = mapProject(updatedResp);

      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );

      setModalData(null);
      setCurrentForm(null);
    } catch (e) {
      console.error("Не вдалося оновити проєкт:", e);
      alert("Помилка при збереженні змін");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      await deleteProject(id, token);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Failed to delete project", e);
      alert("Не вдалося видалити проєкт");
    }
  };
  if (loading) {
    return <div className="text-center py-10">Завантаження...</div>;
  }

  return (
    <>
      <div className=" max-w-fit mx-auto mt-16 px-5 md:px-15">
        <CrewCalendar />
      </div>

      <section
        className={`${styles.clients} max-w-[1126px] m-auto pt-[46px] pl-[20px] pb-[35px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[60px] md:pb-[50px]`}
      >
        <AllProjectsList
          projects={projects}
          onDelete={handleDelete}
          onEdit={(updated) => {
            setModalData(updated);
            setCurrentForm(updated);
          }}
          onAdd={() => {}}
          role={roleStr}
          tablesTytle="Всі проєкти"
          onRefreshReport={(id) => {}}
        />

        {/* <Calendar /> */}

        {currentForm && modalData && (
          <FormModal
            title="Редагувати проєкт"
            onClose={() => {
              setModalData(null);
              setCurrentForm(null);
            }}
            onSave={handleSaveProject}
            isValid={
              !!currentForm.name &&
              !!currentForm.client_id &&
              !!currentForm.team_id
            }
          >
            <ProjectsFormModal
              project={modalData}
              onChange={(updated) => setCurrentForm(updated)}
            />
          </FormModal>
        )}
      </section>
    </>
  );
}
