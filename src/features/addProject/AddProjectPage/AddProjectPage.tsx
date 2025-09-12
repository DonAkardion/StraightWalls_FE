"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import styles from "./AddProjectPage.module.css";

import { ClientSelector } from "@/components/addProject/ClientSelector/ClientSelector";
import { ObjectSelector } from "@/components/addProject/ClientSelector/ObjectSelector";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
import { ProjectMaterials } from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterials";
import { PaymentDetails } from "@/components/Project/ProjectsDetailed/ProjectPayment/PaymentDetails/PaymentDetails";
import { MaterialIncomeEditor } from "@/components/addProject/MaterialIncomeEditor/MaterialIncomeEditor";
import { CrewSelector } from "@/components/addProject/CrewSelector/CrewSelector";
import { AddProjectCrew } from "@/components/addProject/AddProjectCrew/AddProjectCrew";

import {
  useProjectCreation,
  ServiceWithQuantity,
  MaterialWithQuantity,
} from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import { getClients } from "@/api/clients";
import { getServices } from "@/api/services";
import { getMaterials } from "@/api/material";
import { createProject } from "@/api/projects";
import { Client, ClientObject } from "@/types/client";
import { useUser } from "@/context/UserContextProvider";
import { ProjectNameInput } from "@/components/addProject/ProjectNameInput/ProjectNameInput";
import {
  mapWorks,
  mapMaterials,
} from "@/features/addProject/AddProjectConfirm/AddProjectConfirm";
import { MaterialSelection } from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterials";

export function AddProjectPage() {
  const {
    name,
    setName,
    clientId,
    setClientId,
    objectId,
    setObjectId,
    services,
    setServices,
    materials,
    setMaterials,
    advanceAmount,
    crewId,
    setCrewId,
    materialsIncomeTotal,
    initialPayment,
  } = useProjectCreation();

  const { token } = useUser();
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  const [clients, setClients] = useState<Client[]>([]);
  const selectedClient = clients.find((c) => c.id === clientId);

  const [objects, setObjects] = useState<ClientObject[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isNameTouched, setIsNameTouched] = useState(false);

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      try {
        setLoading(true);
        const [clientsData, servicesData, materialsData] = await Promise.all([
          getClients(token),
          getServices(token, { active_only: true }),
          getMaterials(token),
        ]);

        setClients(clientsData);

        setServices(servicesData.map((s) => ({ ...s, quantity: 0 })));
        setMaterials(
          materialsData.map((m) => ({
            ...m,
            quantity: 0,
            previous_remaining: 0,
            additional_delivery: 0,
            current_remaining: 0,
            delivery_quantity: 0,
          }))
        );
      } catch (err) {
        setError("Не вдалося завантажити дані");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [token, setServices, setMaterials]);

  useEffect(() => {
    if (!clientId) return;

    const selectedClient = clients.find((c) => c.id === clientId);
    if (selectedClient) {
      setObjects(selectedClient.objects || []);

      if (selectedClient.objects && selectedClient.objects.length > 0) {
        setObjectId(selectedClient.objects[0].id);
      } else {
        setObjectId(null);
      }
    } else {
      setObjects([]);
      setObjectId(null);
    }
  }, [clientId, clients, setObjectId]);

  useEffect(() => {
    if (isNameTouched) return;

    const client = clients.find((c) => c.id === clientId);
    const object = objects.find((o) => o.id === objectId);

    if (client && object) {
      setName(`${client.full_name} / ${object.name}`);
    } else if (client) {
      setName(`${client.full_name}`);
    }
  }, [clientId, objectId, clients, objects, setName, isNameTouched]);

  const handleServiceSelectionChange = (
    updated: { serviceId: number; quantity: number }[]
  ) => {
    const newServices: ServiceWithQuantity[] = services.map((s) => {
      const found = updated.find((u) => u.serviceId === s.id);
      if (!found) return s;
      return { ...s, quantity: found.quantity };
    });

    setServices(newServices);
  };

  const handleMaterialsSelectionChange = (updated: MaterialSelection[]) => {
    const newMaterials: MaterialWithQuantity[] = materials.map((m) => {
      const found = updated.find((u) => u.materialId === m.id);
      if (!found) return m;

      return {
        ...m,
        quantity: found.quantity,
        previous_remaining: found.previous_remaining ?? 0,
        additional_delivery: found.additional_delivery ?? 0,
        current_remaining: found.current_remaining ?? 0,
        delivery_quantity:
          found.delivery_quantity ??
          Math.max(0, (found.quantity ?? 0) - (found.previous_remaining ?? 0)),
      };
    });

    setMaterials(newMaterials);
  };

  const handleSubmit = async () => {
    if (!token) return;

    const payload = {
      project: {
        name,
        client_id: String(clientId),
        object_id: String(objectId),
        team_id: String(crewId),
        status: "thinking",
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
      router.push(`/${role}/projects`);
    } catch (error) {
      console.error("Помилка створення проєкту", error);
    }
  };

  const errors: string[] = [];
  if (!clientId) errors.push("Оберіть клієнта");
  if (!!objects.length && !objectId) errors.push("У клієнта відсутній об’єкт");
  if (!name?.trim()) errors.push("Відсутня назву проєкту");
  if (!crewId) errors.push("Оберіть бригаду");

  const isFormValid = errors.length === 0;

  const totalWorksCost = useMemo(() => {
    return services.reduce((sum, s) => sum + s.price * s.quantity, 0);
  }, [services]);

  const totalMaterialCost = useMemo(() => {
    return materials.reduce(
      (sum, m) =>
        sum + m.base_selling_price * m.quantity + m.base_delivery * m.quantity,
      0
    );
  }, [materials]);

  const formatNumber = (n: number) => n.toFixed(2).replace(".", ",");

  if (loading)
    return (
      <div className="absolute top-[30%] left-[60%] ">Завантаження ...</div>
    );
  if (error)
    return (
      <div className="text-red-500 absolute top-[30%] left-[60%] ">{error}</div>
    );

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      {/* Назва, Клієнт та його об'єкти */}
      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center justify-between gap-[15px] md:gap-[22px] mb-[30px]`}
      >
        <span className={`${styles.selectorTytle} whitespace-nowrap`}>
          ПІБ клієнта
        </span>

        <ClientSelector
          clients={clients}
          value={clientId}
          onChange={setClientId}
        />
      </div>
      {clientId && objects.length > 0 && (
        <div
          className={`${styles.selector} flex flex-col md:flex-row items-center justify-between gap-[15px] md:gap-[22px] mb-[30px]`}
        >
          <span className={`${styles.selectorTytle} whitespace-nowrap`}>
            Об’єкт
          </span>
          <ObjectSelector
            objects={objects}
            value={objectId}
            onChange={setObjectId}
          />
        </div>
      )}

      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center justify-between gap-[15px] md:gap-[22px] mb-[30px]`}
      >
        <span className={`${styles.selectorTytle} whitespace-nowrap`}>
          Назва Проєкту
        </span>
        <ProjectNameInput onUserInput={() => setIsNameTouched(true)} />
      </div>
      {/* Кошторис по послугах */}
      <div className="relative">
        <ProjectEstimate
          services={services}
          editable={true}
          onSelectionChange={handleServiceSelectionChange}
          tableClassName="projectEstimateTableWrap"
          tablesTitle="Складання кошторису"
        />
        <span
          className={`${styles.clientsSendToViber} absolute top-[26px] right-[5px] sm:top-[6px] md:top-[24px] md:right-[5px] cursor-pointer`}
        >
          Відправити на Viber
        </span>
      </div>
      {/* Матеріали */}
      <div className="relative mt-[150px]">
        <ProjectMaterials
          editable={true}
          tablesTitle="Матеріали"
          materials={materials}
          onSelectionChange={handleMaterialsSelectionChange}
          tableClassName="projectAddMaterialsTableWrap"
        />
        {materials.length > 0 && (
          <span
            className={`${styles.clientsDownloadPDF} absolute top-[10px] right-[5px] md:top-[26px] md:right-[5px] cursor-pointer`}
          >
            Завантажити PDF
          </span>
        )}
      </div>

      <MaterialIncomeEditor
        materials={materials}
        tableClassName="projectMaterialsIncomeEditorWrap"
        tablesTytle="Заробіток на матеріалах"
      />

      <div className={`${styles.materialPayment} my-[40px] md:my-[100px] `}>
        <PaymentDetails
          items={[
            { label: "Аванс за матеріали", value: `${advanceAmount} грн` },
          ]}
          editable
        />
      </div>
      {/* Бригада */}
      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center gap-[15px] md:gap-[22px] mb-[30px]`}
      >
        <span className={`${styles.selectorTytle} whitespace-nowrap`}>
          Назва бригади
        </span>
        <CrewSelector value={crewId} onChange={setCrewId} />
      </div>

      <AddProjectCrew team_id={crewId} />

      {/* Платіжні деталі */}

      <div className={`${styles.PaymentDetailsWrap} mb-[60px] mt-[60px]`}>
        <PaymentDetails
          items={[
            {
              label: "Вартість усіх виконаних робіт",
              value: `${formatNumber(totalWorksCost)} грн`,
            },
            {
              label: "Вартість усіх використаних матеріалів",
              value: `${formatNumber(totalMaterialCost)} грн`,
            },
            {
              label: "Заробіток на матеріалах",
              value: `${formatNumber(materialsIncomeTotal)} грн`,
            },
            {
              label: "Аванс при заїзді бригади",
              value: `${formatNumber(advanceAmount)} грн`,
            },
          ]}
        />
      </div>
      {/* Кнопка */}
      <div className="relative group w-full">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`${
            styles.nextPageBtn
          } flex items-center justify-center h-[80px] w-full rounded-[5px] ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Відправити
        </button>
        {!isFormValid && errors.length > 0 && (
          <div
            className={`${styles.Tooltip} absolute bottom-full mb-2 left-1/2 -translate-x-1/2 max-w-[340px] px-3 py-2 rounded opacity-0 group-hover:opacity-70 transition whitespace-pre-line`}
          >
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
