"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { Material } from "@/types/material";
import { mockMaterials } from "@/mock/Materials/materialsMock";

type Col<T> = {
  key: keyof T | string;
  label: string;
  tooltip?: (item: T) => string;
  render?: (item: T) => React.ReactNode;
};

interface Props {
  expandedId?: string | null;
  onInspect?: (item: Material) => void;
  enableTooltips?: boolean;
  columns?: Col<Material>[];
  data?: Material[];
  className?: string;
}

export function ProjectMaterialsTable({
  expandedId = null,
  onInspect,
  enableTooltips = true,
  columns,
  data,
  className,
}: Props) {
  const parsePrice = (price: string) => Number(String(price).replace(",", "."));

  const defaultColumns: Col<Material>[] = [
    {
      key: "name",
      label: "Назва матеріалу",
      tooltip: (m) => `Матеріал: ${m.name}`,
    },
    { key: "amount", label: "Кількість" },
    { key: "price", label: "Ціна" },
    {
      key: "totalPrice",
      label: "Сума",
      render: (material: Material) =>
        (material.amount * parsePrice(material.price))
          .toFixed(2)
          .replace(".", ","),
    },
  ];

  const cols = columns ?? defaultColumns;
  const rows = data ?? mockMaterials;

  const renderInspectFields = (item: Material) =>
    cols
      .filter((c) => c.key !== "name" && c.key !== "amount")
      .map((c) => {
        const value = (() => {
          if (c.render) {
            const node = c.render(item);
            if (typeof node === "string" || typeof node === "number")
              return String(node);
            return "";
          } else {
            if (typeof c.key === "string" && c.key in item) {
              const v = (item as unknown as Record<string, unknown>)[c.key];
              return v === undefined || v === null ? "" : String(v);
            }
            return "";
          }
        })();

        // якщо value порожнє, не включаємо в інспект
        if (value.trim() === "") return null;

        return {
          label: c.label,
          value: () => value,
        };
      })
      .filter(Boolean) as { label: string; value: () => string }[];

  return (
    <div>
      <Table<Material>
        data={rows}
        expandedId={expandedId}
        columns={cols}
        showIndex={true}
        enableTooltips={enableTooltips}
        onInspect={onInspect}
        className={className}
        renderInspection={(material) => (
          <Inspect<Material>
            item={material}
            getId={(it) => it.id}
            fields={renderInspectFields(material)}
          />
        )}
      />
    </div>
  );
}
