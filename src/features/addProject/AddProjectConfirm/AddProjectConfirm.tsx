"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./AddProjectConfirm.module.css";
import { MaterialsEditor } from "@/components/addProject/MaterialsEditor/MaterialsEditor";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
// import { AddProjectCrew } from "@/components/addProject/AddProjectCrew/AddProjectCrew";
import { PaymentDetails } from "@/components/Project/ProjectsDetailed/ProjectPayment/PaymentDetails/PaymentDetails";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

export function AddProjectConfirm() {
  const params = useParams();
  const role = params.role as string;

  const { name, description, clientId, crewId, services, materials } =
    useProjectCreation();

  const handleSubmit = () => {
    console.log("Проєкт до створення:", {
      name,
      description,
      clientId,
      crewId,
      services,
      materials,
    });
  };

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      {/* Кошторис по послугах */}
      <ProjectEstimate
        editable={false}
        services={services}
        tableClassName="projectEstimateTableWrap"
        tablesTitle="Складання кошторису"
      />

      {/* Матеріали */}
      <MaterialsEditor materials={materials} tablesTytle="Матеріали" />

      <div className={`${styles.Separator} md:h-[80px]`}></div>

      {/* Бригада */}
      {/* <AddProjectCrew team_id={crewId} /> */}

      {/* Платіжні деталі */}
      <div className={`${styles.PaymentDetailsWrap} mb-[60px] mt-[60px]`}>
        <PaymentDetails
          items={[
            { label: "Вартість усіх виконаних робіт", value: "41 057,5 грн" },
            {
              label: "Вартість усіх використаних матеріалів",
              value: "31 454 грн",
            },
            { label: "Аванс при заїзді бригади", value: "2 000 грн" },
          ]}
        />
      </div>

      <Link
        href={`/${role}/`}
        onClick={handleSubmit}
        className={`${styles.nextPageBtn} flex items-center justify-center h-[80px] w-full cursor-pointer rounded-[5px]`}
      >
        Відправити
      </Link>
    </section>
  );
}
