"use client";
import React from "react";
import { useRouter } from "next/navigation";
import backIcon from "../../../../../public/icons/Back.svg";
import { IconButton } from "@/features/clients/ClientsColumns/ClientsButtons";
import styles from "./ClientsInitials.module.css";
import { Client } from "@/types/client";
import { ClientInfoItem } from "../ClientInfo/ClientInfo";
import { iconMap } from "@/features/clients/ClientsColumns/iconMap";
import { columns } from "@/features/clients/ClientsColumns/ClientsColumns";

type Props = {
  client: Client;
  role?: string;
};

export const ClientsInitials = ({ client, role }: Props) => {
  const router = useRouter();

  const formatObjects = (client: Client) =>
    client.objects.map((o) => `${o.name}: ${o.address}`).join(", ");

  return (
    <div className={`${styles.clientsInitialsDiv} w-full relative`}>
      <div className="flex items-center justify-between">
        <h2 className="text-black text-[30px] font-sans">{client.full_name}</h2>
        <div
          onClick={() => router.back()}
          className={`${styles.backBtnMobile} flex items-center gap-2 text-sm text-gray-500 hover:underline cursor-pointer`}
        >
          <IconButton
            icon={backIcon}
            alt="Назад"
            onClick={() => router.back()}
          />
          <span className="text-gray-500 text-[17px]">Назад</span>
        </div>
      </div>

      <div
        className={`${styles.infoItemsWrapper} flex flex-wrap items-center gap-10`}
      >
        {columns.map((column) => {
          const value = client[column];
          if (!value || (Array.isArray(value) && value.length === 0))
            return null;

          if (column === "objects") {
            return (
              <div key={column} className="flex flex-col gap-2">
                {client.objects.map((obj) => {
                  const label = `${obj.name}: ${obj.address}`;
                  const isEditable = role === "admin" || role === "accountant"; // 👈 дозволені ролі
                  return (
                    <ClientInfoItem
                      key={obj.id}
                      icon={iconMap[column]}
                      label={label}
                      onClick={
                        isEditable
                          ? () =>
                              router.push(
                                `/admin/clients/clientsDetailed/${client.id}/objectDetailed/${obj.id}`
                              )
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            );
          }

          if (column === "phone_number") {
            return (
              <ClientInfoItem
                key={column}
                icon={iconMap[column]}
                label={value as string}
              />
            );
          }
        })}
      </div>
    </div>
  );
};
