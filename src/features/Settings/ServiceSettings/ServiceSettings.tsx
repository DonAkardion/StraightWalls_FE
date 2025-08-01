"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mockServices } from "@/mock/Service/servicesMock";
import { ServiceList } from "@/components/Settings/ServiceSettings/ServiceList";
import { Service, ServiceType } from "@/types/service";

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

  const handleEdit = (updated: Service) => {
    setServices((prev) =>
      prev.map((service) => (service.id === updated.id ? updated : service))
    );
  };

  const handleAdd = (type: ServiceType) => {
    const name = prompt("Назва послуги");
    const unit = prompt("Одиниця виміру");
    const price = parseFloat(prompt("Ціна") || "0");
    const amount = parseFloat(prompt("Кількість") || "1");

    if (!name || !unit) return;

    const newService: Service = {
      id: crypto.randomUUID(),
      name,
      unit,
      price,
      amount,
      serviceType: type,
    };

    setServices((prev) => [...prev, newService]);
  };

  const mainServices = services.filter(
    (s) => s.serviceType === "Основні послуги"
  );
  const additionalServices = services.filter(
    (s) => s.serviceType === "Додаткові роботи"
  );

  return (
    <section
      className={`max-w-[1126px] m-auto md:pt-[60px] md:pr-[80px] md:pl-[60px] md:pb-[40px] pt-[40px] pr-[14px] pb-[74px] pl-[26px]`}
    >
      <div className={`flex flex-col md:gap-[60px] gap-[40px]`}>
        <ServiceList
          services={mainServices}
          type="Основні послуги"
          onDelete={handleDelete}
          onEdit={handleEdit}
          onAdd={() => handleAdd("Основні послуги")}
        />

        <ServiceList
          services={additionalServices}
          type="Додаткові роботи"
          onDelete={handleDelete}
          onEdit={handleEdit}
          onAdd={() => handleAdd("Додаткові роботи")}
        />
      </div>
    </section>
  );
}
