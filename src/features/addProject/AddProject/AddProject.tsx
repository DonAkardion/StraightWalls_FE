"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./AddProject.module.css";
import { ClientSelector } from "@/components/addProject/ClientSelector/ClientSelector";
import { ProjectEstimate } from "@/components/Project/ProjectsDetailed/ProjectEstimate/ProjectEstimate";
import {
  useProjectCreation,
  ServiceWithQuantity,
} from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import { getClients } from "@/api/clients";
import { getServices } from "@/api/services";
import { Client } from "@/types/client";
import { useUser } from "@/context/UserContextProvider";
import { ProjectNameInput } from "@/components/addProject/ProjectNameInput/ProjectNameInput";

export function AddProject() {
  const { clientId, setClientId, services, setServices, resetProject } =
    useProjectCreation();
  const { token } = useUser();
  const params = useParams();
  const role = params.role as string;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSelection, setLocalSelection] =
    useState<ServiceWithQuantity[]>(services);

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    resetProject();

    const fetchData = async () => {
      if (!token) {
        setError("Немає токена для авторизації");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Отримуємо клієнтів
        const clientsData = await getClients(token);
        setClients(clientsData);

        // Отримуємо активні послуги
        const servicesData = await getServices(token, { active_only: true });
        const servicesWithQuantity: ServiceWithQuantity[] = servicesData.map(
          (s) => ({ ...s, quantity: 0 })
        );
        setServices(servicesWithQuantity);
        setLocalSelection(servicesWithQuantity);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити дані");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resetProject, token, setServices]);

  // оновлення контексту після зміни локальної selection
  useEffect(() => {
    setServices(localSelection);
  }, [localSelection, setServices]);

  // Обробка змін кількості послуг
  const handleSelectionChange = (
    updated: { serviceId: number; quantity: number }[]
  ) => {
    const newServices: ServiceWithQuantity[] = services.map((s) => {
      const found = updated.find((u) => u.serviceId === s.id);
      return found ? { ...s, quantity: found.quantity } : s;
    });
    setServices(newServices);
  };

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center justify-between gap-[15px] md:gap-[22px] mb-[30px]`}
      >
        <span className={`${styles.selectorTytle} whitespace-nowrap`}>
          Назва Проэкту
        </span>
        <ProjectNameInput />
      </div>
      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center justify-between gap-[15px] md:gap-[22px] mb-[30px]`}
      >
        <span className={`${styles.selectorTytle} whitespace-nowrap`}>
          ПІБ клієнта
        </span>

        {loading ? (
          <div>Завантаження...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <ClientSelector
            clients={clients}
            value={clientId}
            onChange={setClientId}
          />
        )}
      </div>

      <div className="relative">
        <ProjectEstimate
          services={services}
          editable={true}
          onSelectionChange={handleSelectionChange}
          tableClassName="projectEstimateTableWrap"
          tablesTitle="Складання кошторису"
        />
        <span
          className={`${styles.clientsSendToViber} absolute top-[6px] right-[5px] md:top-[24px] md:right-[5px] cursor-pointer`}
        >
          Відправити на Viber
        </span>
      </div>

      <Link
        href={`/${role}/addProject/addProjectMaterials`}
        className={`${styles.nextPageBtn} flex items-center justify-center h-[80px] w-full cursor-pointer rounded-[5px]`}
      >
        Відправити
      </Link>
    </section>
  );
}
