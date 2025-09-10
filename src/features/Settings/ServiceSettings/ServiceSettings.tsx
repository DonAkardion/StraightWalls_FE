"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContextProvider";
import { Service } from "@/types/service";
import { ServiceList } from "@/components/Settings/ServiceSettings/ServiceList";
import { FormModal } from "@/components/Table/Form/FormModal";
import { ServiceFormModal } from "@/components/Settings/ServiceSettings/ServiceFormModal";
import {
  getServices,
  createService,
  updateService,
  deleteService as apiDeleteService,
} from "@/api/services";

export function ServiceSettings() {
  const { token } = useUser();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentForm, setCurrentForm] = useState<Service | null>(null);

  // Завантаження всіх послуг
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getServices(token);
        setServices(data);
      } catch (err) {
        console.error("Помилка при завантаженні послуг:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const openAddModal = (type: "main" | "additional") => {
    const draft: Omit<Service, "id" | "created_at" | "updated_at"> = {
      name: "",
      unit_of_measurement: "",
      price: 0,
      salary: 0,
      service_type: type,
      description: "",
      is_active: true,
    };
    setCurrentForm(draft as Service);
  };

  const openEditModal = (service: Service) => {
    setCurrentForm(service);
  };

  const deleteService = async (id: number) => {
    if (!token) return;
    try {
      await apiDeleteService(token, id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Помилка при видаленні послуги:", err);
    }
  };

  const saveService = async (service: Service) => {
    if (!token) return;

    try {
      let saved: Service;

      if (service.id) {
        const { id, ...updates } = service;
        saved = await updateService(token, id, updates);
        setServices((prev) => prev.map((s) => (s.id === id ? saved : s)));
      } else {
        const { ...payload } = service;
        saved = await createService(
          token,
          payload as Omit<Service, "id" | "created_at" | "updated_at">
        );
        setServices((prev) => [...prev, saved]);
      }

      setCurrentForm(null);
    } catch (err) {
      console.error("Помилка при збереженні послуги:", err);
    }
  };

  const isValid =
    !!currentForm?.name &&
    !!currentForm?.unit_of_measurement &&
    !!currentForm?.service_type &&
    (currentForm?.price ?? 0) > 0 &&
    (currentForm?.salary ?? 0) > 0;
  if (loading) {
    return <div className="p-4 text-center">Завантаження...</div>;
  }

  // Розділення по типу
  const mainServices = services.filter((s) => s.service_type === "main");
  const additionalServices = services.filter(
    (s) => s.service_type === "additional"
  );

  return (
    <section
      className={`relative max-w-[1126px] m-auto md:pt-[60px] md:pr-[80px] md:pl-[60px] md:pb-[40px] pt-[40px] pr-[14px] pb-[74px] pl-[26px] `}
    >
      <div className="mb-[40px] md:mb-[60px]">
        <ServiceList
          type="main"
          services={mainServices}
          onAdd={() => openAddModal("main")}
          onEdit={openEditModal}
          onDelete={(id) => deleteService(id)}
        />
      </div>
      <div>
        <ServiceList
          type="additional"
          services={additionalServices}
          onAdd={() => openAddModal("additional")}
          onEdit={openEditModal}
          onDelete={(id) => deleteService(id)}
        />
      </div>
      {currentForm && (
        <FormModal
          title={currentForm.id ? "Редагувати послугу" : "Нова послуга"}
          onClose={() => setCurrentForm(null)}
          onSave={() => {
            if (isValid) saveService(currentForm);
          }}
          isValid={isValid}
        >
          <ServiceFormModal
            service={currentForm}
            onChange={(updated) => setCurrentForm(updated)}
          />
        </FormModal>
      )}
    </section>
  );
}
