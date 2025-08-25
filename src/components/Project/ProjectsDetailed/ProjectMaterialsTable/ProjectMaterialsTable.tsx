"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { ProjectMaterial } from "@/types/projectComponents";

type Col<T> = {
  key: keyof T | string;
  label: string;
  tooltip?: (item: T) => string;
  render?: (item: T) => React.ReactNode;
};

interface Props {
  expandedId?: number | null;
  onInspect?: (item: ProjectMaterial) => void;
  enableTooltips?: boolean;
  columns?: Col<ProjectMaterial>[];
  data?: ProjectMaterial[];
  className?: string;
  onAdd?: () => void;
  onEdit?: (item: ProjectMaterial) => void;
  onDelete?: (item: ProjectMaterial) => void;
}

export function ProjectMaterialsTable({
  expandedId = null,
  onInspect,
  enableTooltips = true,
  columns,
  data,
  className,
  onEdit,
  onDelete,
}: Props) {
  const defaultColumns: Col<ProjectMaterial>[] = [
    {
      key: "name",
      label: "Назва матеріалу",
      tooltip: (m) => `Матеріал: ${m.name}`,
    },
    { key: "unit", label: "Одиниця" },
    { key: "quantity", label: "Кількість" },
    {
      key: "unit_price",
      label: "Ціна за одиницю",
      render: (m) => m.unit_price.toFixed(2).replace(".", ","),
    },
    {
      key: "total",
      label: "Сума",
      render: (m) => (m.quantity * m.unit_price).toFixed(2).replace(".", ","),
    },
  ];

  const cols = columns ?? defaultColumns;
  const rows = data ?? [];

  const renderInspectFields = (item: ProjectMaterial) =>
    cols
      .filter(
        (c) => c.key !== "name" && c.key !== "quantity" && c.key !== "actions"
      )
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
              return v == null ? "" : String(v);
            }
            return "";
          }
        })();

        if (value.trim() === "") return null;
        return { label: c.label, value: () => value };
      })
      .filter(Boolean) as { label: string; value: () => string }[];

  return (
    <div>
      <Table<ProjectMaterial>
        data={rows}
        expandedId={expandedId}
        columns={cols}
        showIndex
        enableTooltips={enableTooltips}
        onInspect={onInspect}
        onEdit={onEdit}
        onDelete={onDelete}
        className={className}
        renderInspection={(material) => (
          <Inspect<ProjectMaterial>
            item={material}
            getId={(it) => it.id}
            fields={renderInspectFields(material)}
            onDelete={
              onDelete ? (id) => onDelete({ id } as ProjectMaterial) : undefined
            }
          />
        )}
      />
    </div>
  );
}
