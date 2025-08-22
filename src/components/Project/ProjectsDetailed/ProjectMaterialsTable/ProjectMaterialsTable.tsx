"use client";

import React from "react";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { ProjectMaterial } from "@/types/projectComponents";
import { Pen, Trash, Plus } from "lucide-react";

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
  onAdd,
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
      key: "totalPrice",
      label: "Сума",
      render: (m) => (m.quantity * m.unit_price).toFixed(2).replace(".", ","),
    },
  ];

  const actionColumn: Col<ProjectMaterial> = {
    key: "actions",
    label: "Дії",
    render: (material: ProjectMaterial) => (
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(material)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pen size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(material)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash size={16} />
          </button>
        )}
      </div>
    ),
  };

  const cols =
    onEdit || onDelete
      ? [...(columns ?? defaultColumns), actionColumn]
      : columns ?? defaultColumns;

  // Тепер без моків
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
              return v === undefined || v === null ? "" : String(v);
            }
            return "";
          }
        })();

        if (value.trim() === "") return null;

        return {
          label: c.label,
          value: () => value,
        };
      })
      .filter(Boolean) as { label: string; value: () => string }[];

  return (
    <div>
      {onAdd && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onAdd}
            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            <Plus size={16} /> Додати матеріал
          </button>
        </div>
      )}

      <Table<ProjectMaterial>
        data={rows}
        expandedId={expandedId}
        columns={cols}
        showIndex
        enableTooltips={enableTooltips}
        onInspect={onInspect}
        className={className}
        renderInspection={(material) => (
          <Inspect<ProjectMaterial>
            item={material}
            getId={(it) => it.id}
            fields={renderInspectFields(material)}
          />
        )}
      />
    </div>
  );
}
