"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { mockServices } from "@/mock/Service/servicesMock";
import { ServiceList } from "@/components/Settings/ServiceSettings/ServiceList";

export function ServiceSettings() {
  const { role } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (role !== "admin") {
      router.replace(`/${role}/settings`);
    }
  }, [role, router]);

  return (
    <section
      className={`max-w-[1126px] m-auto md:pt-[60px] md:pr-[80px] md:pl-[60px] md:pb-[40px] pt-[40px] pr-[14px] pb-[74px] pl-[26px]`}
    >
      <div className={`flex flex-col md:gap-[60px] gap-[40px]`}>
        <ServiceList services={mockServices} type="Основні послуги" />
        <ServiceList services={mockServices} type="Додаткові роботи" />
      </div>
    </section>
  );
}
