"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/types/client";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";

interface Props {
  clients: Client[];
  onDelete: (id: number) => void;
  onEdit: (updated: Client) => void;
  onAdd: () => void;
  role?: string;
  enableTooltips?: boolean;
}

export const ClientsList = ({
  role,
  clients,
  onDelete,
  onEdit,
  onAdd,
  enableTooltips = true,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const router = useRouter();

  const handleRowClick = (id: number) => {
    if (!role) return;
    router.push(`/${role}/clients/clientsDetailed/${id}`);
  };

  return (
    <div className="">
      <Table<Client>
        data={clients}
        expandedId={expandedId}
        className="clientsTableWrap"
        onAdd={role === "admin" ? onAdd : undefined}
        onEdit={role === "admin" ? onEdit : undefined}
        onDelete={role === "admin" ? (item) => onDelete(item.id) : undefined}
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        onRowClick={handleRowClick}
        enableTooltips={enableTooltips}
        addButtonText="Додати клієнта"
        columns={[
          {
            key: "full_name",
            label: "Конактна особа",
            tooltip: (client) => `Повне ім’я: ${client.full_name}`,
          },
          {
            key: "phone_number",
            label: "Телефон",
            tooltip: (client) => `Телефон: ${client.phone_number}`,
          },
          {
            key: "objects",
            label: "Об’єкти",
            tooltip: (client) => client.objects.join(", "),
            render: (client) => client.objects.join(", "),
          },
        ]}
        renderInspection={(client) => (
          <Inspect<Client>
            item={client}
            getId={(item) => item.id}
            onEdit={role === "admin" ? onEdit : undefined}
            onDelete={role === "admin" ? onDelete : undefined}
            fields={[
              {
                label: "Телефон",
                value: (item) => item.phone_number,
              },
              {
                label: "Об’єкти",
                value: (item) => item.objects.join(", "),
              },
            ]}
          />
        )}
      />
    </div>
  );
};
