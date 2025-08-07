"use client";
import styles from "./Projects.module.css";
import { mockProjects } from "@/mock/Project/mockProjects";
import { Project } from "@/types/project";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AllProjectsList } from "@/components/Projects/AllProjectsList";
import { Crew } from "@/types/crew";
import { mockCrews } from "@/mock/Crew/crewMock";
import { Client } from "@/types/client";
import { mockClients } from "@/mock/Clients/clientsMock";

export function Projects() {
  const { role } = useParams();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [crews] = useState<Crew[]>(mockCrews);
  const [clients] = useState<Client[]>(mockClients);

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
    </section>
  );
}
