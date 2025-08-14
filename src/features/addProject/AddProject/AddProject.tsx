"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import styles from "./AddProject.module.css";
import { ClientSelector } from "@/components/addProject/ClientSelector/ClientSelector";
import { mockClients } from "@/mock/Clients/clientsMock";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import { mockServices } from "@/mock/Service/servicesMock";

export function AddProject() {
  const { clientId, setClientId, services, setServices } = useProjectCreation();
  const { resetProject } = useProjectCreation();
  const params = useParams();
  const role = params.role as string;

  // guard від подвійного виклику ефектів у StrictMode
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    // скидаємо стан нового проєкту
    resetProject();

    // ініціалізуємо початкові дані з моків
    if (mockServices.length) setServices(mockServices);
  }, [resetProject, setClientId, setServices]);

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center gap-[15px] md:gap-[22px] mb-[30px]`}
      >
        <span className={`${styles.selectorTytle} whitespace-nowrap `}>
          ПІБ клієнта
        </span>
        <ClientSelector
          clients={mockClients}
          value={clientId}
          onChange={setClientId}
        />
      </div>
      <ProjectEstimate
        services={services}
        editable={true}
        onServicesChange={(updated) => setServices(updated)}
        tableClassName="projectEstimateTableWrap"
      />

      <Link
        href={`/${role}/addProject/addProjectMaterials`}
        className={`${styles.nextPageBtn} flex items-center justify-center h-[80px] w-full cursor-pointer rounded-[5px]`}
      >
        Відправити
      </Link>
    </section>
  );
}
