"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./AddProjectConfirm.module.css";
import { MaterialsEditor } from "@/components/addProject/MaterialsEditor/MaterialsEditor";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
import { AddProjectCrew } from "@/components/addProject/AddProjectCrew/AddProjectCrew";
import { PaymentDetails } from "@/components/Project/ProjectsDetailed/ProjectPayment/PaymentDetails/PaymentDetails";
import { useUser } from "@/context/UserContextProvider";
import { createProject } from "@/api/projects";
import {
  useProjectCreation,
  ServiceWithQuantity,
  MaterialWithCalc,
  ProjectPaymentDraft,
} from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

function mapWorks(services: ServiceWithQuantity[]) {
  return services
    .filter((s) => s.quantity > 0)
    .map((s) => ({
      name: s.name,
      description: s.description,
      cost: String(s.price),
      quantity: String(s.quantity),
      unit: s.unit_of_measurement,
    }));
}

function mapMaterials(materials: MaterialWithCalc[]) {
  return materials
    .filter((m) => m.quantity > 0)
    .map((m) => ({
      name: m.name,
      purchase_price: String(m.purchase_price),
      selling_price: String(m.selling_price),
      remaining_stock: String(m.quantity),
      delivery: m.delivery ? String(m.delivery) : "0",
      unit: m.unit,
    }));
}

export function AddProjectConfirm() {
  const params = useParams();
  const role = params.role as string;

  const {
    name,
    clientId,
    objectId,
    crewId,
    services,
    materials,
    materialsIncomeTotal,
    initialPayment,
    advanceAmount,
  } = useProjectCreation();

  const { token } = useUser();

  const handleSubmit = async () => {
    if (!token) return;

    const payload = {
      project: {
        name: name,
        client_id: String(clientId),
        object_id: String(objectId),
        team_id: String(crewId),
        status: "new",
      },
      works: mapWorks(services),
      materials: mapMaterials(materials),
      ...(initialPayment && {
        initial_payment: {
          ...initialPayment,
          amount: String(initialPayment.amount),
        },
      }),
    };

    try {
      const response = await createProject(payload, token);
      console.log("Проєкт створено ✅", response);
      // router.push(`/projects/${response.projectId}`);
    } catch (error) {
      console.error("Помилка створення проєкту", error);
    }
  };

  const totalWorksCost = useMemo(() => {
    return services.reduce((sum, s) => sum + s.price * s.quantity, 0);
  }, [services]);

  const totalMaterialCost = useMemo(() => {
    return materials.reduce(
      (sum, m) => sum + m.selling_price * m.quantity + m.delivery * m.quantity,
      0
    );
  }, [materials]);

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
      <AddProjectCrew team_id={crewId} />

      {/* Платіжні деталі */}
      <div className={`${styles.PaymentDetailsWrap} mb-[60px] mt-[60px]`}>
        <PaymentDetails
          items={[
            {
              label: "Вартість усіх виконаних робіт",
              value: `${totalWorksCost} грн`,
            },
            {
              label: "Вартість усіх використаних матеріалів",
              value: `${totalMaterialCost} грн`,
            },
            {
              label: "Заробіток на матеріалах",
              value: `${materialsIncomeTotal} грн`,
            },
            {
              label: "Аванс при заїзді бригади",
              value: `${advanceAmount} грн`,
            },
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
