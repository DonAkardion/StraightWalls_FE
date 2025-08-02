"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mockServices } from "@/mock/Service/servicesMock";
import { ServiceList } from "@/components/Settings/ServiceSettings/ServiceList";
import { Service, ServiceType } from "@/types/service";
import { ServiceFormModal } from "@/components/Settings/ServiceSettings/ServiceFormModal";

export function ServiceSettings() {
  const { role } = useParams();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(mockServices);

  useEffect(() => {
    if (role !== "admin") {
      router.replace(`/${role}/settings`);
    }
  }, [role, router]);

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  const mainServices = services.filter(
    (s) => s.serviceType === "Основні послуги"
  );
  const additionalServices = services.filter(
    (s) => s.serviceType === "Додаткові роботи"
  );

  // modal window
  const [modalData, setModalData] = useState<{
    service?: Service;
    type: ServiceType;
  } | null>(null);

  const openEditModal = (service: Service) => {
    setModalData({ service, type: service.serviceType });
  };

  const openAddModal = (type: ServiceType) => {
    setModalData({ type });
  };

  const handleSave = (newService: Service) => {
    setServices((prev) => {
      const exists = prev.find((s) => s.id === newService.id);
      if (exists) {
        return prev.map((s) => (s.id === newService.id ? newService : s));
      }

      return [
        ...prev,
        { ...newService, serviceType: modalData?.type || "Основні послуги" },
      ];
    });
    setModalData(null);
  };

  return (
    <section
      className={`relative max-w-[1126px] m-auto md:pt-[60px] md:pr-[80px] md:pl-[60px] md:pb-[40px] pt-[40px] pr-[14px] pb-[74px] pl-[26px]`}
    >
      <div className={`flex flex-col md:gap-[60px] gap-[40px]`}>
        <ServiceList
          services={mainServices}
          type="Основні послуги"
          onDelete={handleDelete}
          onEdit={openEditModal}
          onAdd={() => openAddModal("Основні послуги")}
        />

        <ServiceList
          services={additionalServices}
          type="Додаткові роботи"
          onDelete={handleDelete}
          onEdit={openEditModal}
          onAdd={() => openAddModal("Додаткові роботи")}
        />
      </div>
      {modalData && (
        <ServiceFormModal
          service={modalData.service}
          type={modalData.type}
          onClose={() => setModalData(null)}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
