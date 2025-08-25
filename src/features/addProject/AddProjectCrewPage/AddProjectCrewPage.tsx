"use client";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import styles from "./AddProjectCrewPage.module.css";
import { CrewSelector } from "@/components/addProject/CrewSelector/CrewSelector";
// import { AddProjectCrew } from "@/components/addProject/AddProjectCrew/AddProjectCrew";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

export function AddProjectCrewPage() {
  const { crewId, setCrewId } = useProjectCreation();
  const params = useParams();
  const role = params.role as string;

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center gap-[15px] md:gap-[22px] mb-[30px]`}
      >
        <span className={`${styles.selectorTytle} whitespace-nowrap`}>
          Назва бригади
        </span>
        <CrewSelector value={crewId} onChange={setCrewId} />
      </div>

      {/* <AddProjectCrew crewId={crewId} /> */}

      <Link
        href={`/${role}/addProject/addProjectConfirm`}
        className={`${styles.nextPageBtn} flex items-center justify-center h-[80px] w-full cursor-pointer rounded-[5px]`}
      >
        Відправити
      </Link>
    </section>
  );
}
