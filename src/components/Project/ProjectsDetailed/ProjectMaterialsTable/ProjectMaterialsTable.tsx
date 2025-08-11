"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { Material } from "@/types/material";
import { mockMaterials } from "@/mock/Materials/materialsMock";

interface Props {
  expandedId: string | null;
  onInspect: (item: Material) => void;
  enableTooltips?: boolean;
}

export function ProjectMaterialsTable({
  expandedId,
  onInspect,
  enableTooltips = true,
}: Props) {
  // Функція для парсингу ціни у число (з урахуванням коми)
  const parsePrice = (price: string) => Number(price.replace(",", "."));
  const columns = [
    {
      key: "name",
      label: "Назва матеріалу",
      tooltip: (material: Material) => `Матеріал: ${material.name}`,
    },
    { key: "amount", label: "Кількість" },
    { key: "price", label: "Ціна" },
    {
      key: "totalPrice",
      label: "Сума",
      render: (material: Material) => {
        const total = material.amount * parsePrice(material.price);
        return total.toFixed(2).replace(".", ",");
      },
    },
  ];
  return (
    <div>
      <Table
        data={mockMaterials}
        expandedId={expandedId}
        columns={columns}
        showIndex={true}
        enableTooltips={enableTooltips}
        onInspect={onInspect}
        renderInspection={(material) => (
          <Inspect<Material>
            item={material}
            getId={(item) => item.id}
            fields={[
              {
                label: "Назва матеріалу",
                value: (item) => item.name,
              },
              {
                label: "Кількість",
                value: (item) => item.amount.toString(),
              },
              {
                label: "Ціна",
                value: (item) => item.price,
              },
              {
                label: "Сума",
                value: (item) => {
                  const total = item.amount * parsePrice(item.price);
                  return total.toFixed(2).replace(".", ",");
                },
              },
            ]}
          />
        )}
      />
    </div>
  );
}
