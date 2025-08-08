"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Service, ServiceType } from "@/types/service";

interface Props {
  services: Service[];
  type: ServiceType;
  showHeader?: boolean;
}

export const ProjectServicesTable = ({
  services,
  type,
  showHeader = true,
}: Props) => {
  const filtered = services.filter((s) => s.serviceType === type);

  return (
    <div className=" ">
      <Table<Service>
        data={filtered}
        showIndex={true}
        showHeader={showHeader}
        columns={[
          { key: "name", label: "Найменування послуги" },
          { key: "unit", label: "Од. вимір." },
          {
            key: "price",
            label: "Вартість, грн",
            render: (s) => `${s.price.toFixed(2)}`,
          },
          {
            key: "sum",
            label: "Сума",
            render: (s) => (s.price * s.amount).toFixed(2),
          },
        ]}
      />
    </div>
  );
};
