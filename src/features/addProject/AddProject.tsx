"use client";
import React, { useState } from "react";
import styles from "./AddProject.module.css";
import { ClientSelector } from "@/components/addProject/ClientSelector/ClientSelector";
import { mockClients } from "@/mock/Clients/clientsMock";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
import { mockServices } from "@/mock/Service/servicesMock";
import { MaterialsEditor } from "@/components/addProject/MaterialsEditor/MaterialsEditor";

export function AddProject() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [services, setServices] = useState(mockServices);
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
      {/* {clientId && (
        <p className="mt-4 text-gray-600">
          Обраний клієнт: {mockClients.find((c) => c.id === clientId)?.name}
        </p>
      )} */}
      <ProjectEstimate
        services={services}
        editable={true}
        onServicesChange={(updated) => setServices(updated)}
        tableClassName="projectEstimateTableWrap"
      />
      <MaterialsEditor />
      <button
        className={`${styles.nextPageBtn} h-[80px] w-full cursor-pointer rounded-[5px]`}
      >
        Відправити
      </button>
    </section>
  );
}
