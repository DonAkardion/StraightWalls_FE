"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/types/client";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import styles from "./ClientsList.module.css";
import { Pen, Trash } from "../../../public/icons";

interface Props {
  clients: Client[];
  onDelete: (id: string) => void;
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  const handleRowClick = (id: string) => {
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
        onRowClick={handleRowClick} // перехід
        enableTooltips={enableTooltips}
        columns={[
          {
            key: "name",
            label: "Ім'я",
            tooltip: (client) => `Повне ім’я: ${client.name}`,
          },
          {
            key: "contactName",
            label: "Контактна особа",
            tooltip: (client) => `Контактна особа: ${client.contactName}`,
          },
          {
            key: "address",
            label: "Адреса",
            tooltip: (client) => `Адреса: ${client.address}`,
          },
          {
            key: "phone",
            label: "Телефон",
            tooltip: (client) => `Телефон: ${client.phone}`,
          },
          {
            key: "mail",
            label: "Пошта",
            tooltip: (client) => `Пошта: ${client.mail}`,
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
                label: "Контактна особа",
                value: (item) => item.contactName,
              },
              {
                label: "Адреса",
                value: (item) => item.address,
              },
              {
                label: "Телефон",
                value: (item) => item.phone,
              },
              {
                label: "Пошта",
                value: (item) => item.mail,
              },
            ]}
          />
        )}
      />
    </div>
  );
};
