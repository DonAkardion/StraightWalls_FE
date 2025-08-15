import React from "react";
import { useRouter } from "next/navigation";
import backIcon from "../../../../../public/icons/Back.svg";
import { columns } from "@/features/clients/ClientsColumns/ClientsColumns";
import { IconButton } from "@/features/clients/ClientsColumns/ClientsButtons";
import { iconMap } from "@/features/clients/ClientsColumns/iconMap";
import styles from "./ClientsInitials.module.css";
import { Client } from "@/types/client";
import { ClientInfoItem } from "../ClientInfo/ClientInfo";

type Props = {
  client: Client;
};

export const ClientsInitials = ({ client }: Props) => {
  const router = useRouter();

  return (
    <div className={`${styles.clientsInitialsDiv} w-full`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-black text-[30px] font-sans">{client.name}</h2>
        <div
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:underline cursor-pointer"
        >
          <IconButton
            icon={backIcon}
            alt="Назад"
            onClick={() => console.log("Back button clicked")}
          />
          <span className="text-gray-500 text-[17px]">Назад</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-10">
        {columns
          .filter((column) => column !== "name")
          .map((column) => (
            <ClientInfoItem
              key={column}
              icon={iconMap[column]}
              label={client[column]}
            />
          ))}
      </div>
    </div>
  );
};
