"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/types/client";
import { Table } from "@/components/Table/Table";
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
        renderInspection={(clients) => (
          <div className=" pb-1  bg-white border-b-1 relative">
            <div className="pl-[20px] pr-[10px] flex flex-col gap-2 ">
              <div className={`${styles.inspectRow} flex justify-between`}>
                <p>
                  <span>Конактна особа: </span>
                  <span className="text-sm ">{clients.contactName}</span>
                </p>
                {role === "admin" && (
                  <img
                    src={Trash.src}
                    alt="Delete"
                    className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                    onClick={() => onDelete(clients.id)}
                  />
                )}
              </div>
              <div className="flex justify-between">
                <p>
                  <span>Адреса: </span>
                  <span className="text-sm ">{clients.address}</span>
                </p>
                {role === "admin" && (
                  <img
                    src={Pen.src}
                    alt="Edit"
                    className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                    onClick={() => onEdit(clients)}
                  />
                )}
              </div>
              <div className="flex justify-between">
                <p>
                  <span>Телефон: </span>
                  <span className="text-sm ">{clients.phone}</span>
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  <span>Пошта: </span>
                  <span className="text-sm ">{clients.mail}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
