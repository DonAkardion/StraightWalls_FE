"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./AddProjectConfirm.module.css";
import { MaterialsEditor } from "@/components/addProject/MaterialsEditor/MaterialsEditor";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
import { AddProjectCrew } from "@/components/addProject/AddProjectCrew/AddProjectCrew";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import { mockCrews } from "@/mock/Crew/crewMock";
import { mockWorkers } from "@/mock/Workers/workersMock";
import { PaymentDetails } from "@/components/Project/ProjectsDetailed/ProjectPayment/PaymentDetails/PaymentDetails";
import { MaterialIncomeEditor } from "@/components/addProject/MaterialIncomeEditor/MaterialIncomeEditor";
import { mockMaterialsIncome } from "@/mock/Materials/materialsIncomeMock";

export function AddProjectConfirm() {
  const params = useParams();
  const role = params.role as string;
  const {
    clientId,
    services,
    setServices,
    materials,
    // setMaterials,
    crewId,
    // setCrewId,
  } = useProjectCreation();

  const handleSubmit = () => {
    // TODO: логіка відправки на бекенд
    console.log("Проєкт:", {
      clientId,
      services,
      materials,
      crewId,
    });
  };
  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center gap-[15px] md:gap-[22px] mb-[30px]`}
      ></div>

      <ProjectEstimate
        services={services}
        editable={true}
        onServicesChange={(updated) => setServices(updated)}
        tableClassName="projectEstimateTableWrap"
      />
      <MaterialsEditor />
      <MaterialIncomeEditor
        materialsIncome={mockMaterialsIncome}
        editable={true}
        onMaterialsIncomeChange={() => {}}
        tableClassName="projectMaterialsIncomeEditorWrap"
      />
      <div className={`${styles.Separator} h-[80px]`}></div>
      <AddProjectCrew crewId={crewId} crews={mockCrews} workers={mockWorkers} />
      <div className={`${styles.PaymentDetailsWrap} mb-[60px] mt-[60px]`}>
        <PaymentDetails
          items={[
            { label: "Вартість усіх виконаних робіт", value: "41 057,5 грн" },
            {
              label: "Вартість усіх використанних матеріалів",
              value: "31 454 грн",
            },
            {
              label: "Аванс при заїзді бригади ",
              value: "2 000 грн",
            },
          ]}
        />
      </div>
      <button
        onClick={handleSubmit}
        className={`${styles.nextPageBtn} h-[80px] w-full cursor-pointer rounded-[5px]`}
      >
        <Link href={`/${role}/`}>Відправити</Link>
      </button>
    </section>
  );
}
