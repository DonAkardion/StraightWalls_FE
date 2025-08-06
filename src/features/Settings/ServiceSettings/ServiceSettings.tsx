"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mockServices } from "@/mock/Service/servicesMock";
import { ServiceList } from "@/components/Settings/ServiceSettings/ServiceList";
import { Service, ServiceType } from "@/types/service";
import { FormModal } from "@/components/Table/Form/FormModal";
import { ServiceFormModal } from "@/components/Settings/ServiceSettings/ServiceFormModal";
import { handleDelete, handleSave } from "@/utils/dataHandlers";

export function ServiceSettings() {
  const { role } = useParams();
  const roleStr = Array.isArray(role) ? role[0] : role;
  // const router = useRouter();

  const [services, setServices] = useState<Service[]>(mockServices);
  const [modalData, setModalData] = useState<{
    service?: Service;
    type: ServiceType;
  } | null>(null);
  const [currentForm, setCurrentForm] = useState<Service | null>(null);

  const mainServices = services.filter(
    (s) => s.serviceType === "Основні послуги"
  );
  const additionalServices = services.filter(
    (s) => s.serviceType === "Додаткові роботи"
  );
  const deleteService = (id: string) => {
    setServices((prev) => handleDelete(prev, id));
  };

  const openEditModal = (service: Service) => {
    setModalData({ service, type: service.serviceType });
    setCurrentForm(service);
  };
  const openAddModal = (type: ServiceType) => {
    const newService: Service = {
      id: crypto.randomUUID(),
      name: "",
      unit: "",
      price: 0,
      amount: 1,
      serviceType: type,
    };
    setModalData({ type });
    setCurrentForm(newService);
  };

  const saveService = (service: Service) => {
    setServices((prev) =>
      handleSave(prev, {
        ...service,
        serviceType: modalData?.type || "Основні послуги",
      })
    );
    setModalData(null);
    setCurrentForm(null);
  };

  return (
    <section
      className={`relative max-w-[1126px] m-auto md:pt-[60px] md:pr-[80px] md:pl-[60px] md:pb-[40px] pt-[40px] pr-[14px] pb-[74px] pl-[26px]`}
    >
      <div className={`flex flex-col md:gap-[60px] gap-[40px]`}>
        <ServiceList
          services={mainServices}
          type="Основні послуги"
          onDelete={deleteService}
          onEdit={openEditModal}
          onAdd={() => openAddModal("Основні послуги")}
        />

        <ServiceList
          services={additionalServices}
          type="Додаткові роботи"
          onDelete={deleteService}
          onEdit={openEditModal}
          onAdd={() => openAddModal("Додаткові роботи")}
        />
      </div>
      {modalData && currentForm && (
        <FormModal
          title={modalData.service ? "Редагувати послугу" : "Нова послуга"}
          onClose={() => {
            setModalData(null);
            setCurrentForm(null);
          }}
          onSave={() => {
            if (currentForm.name && currentForm.unit) {
              saveService(currentForm);
            }
          }}
          isValid={!!currentForm.name && !!currentForm.unit}
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
