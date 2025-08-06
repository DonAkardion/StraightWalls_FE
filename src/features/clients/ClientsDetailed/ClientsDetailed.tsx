"use client";
import { useMemo } from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import styles from "./ClientsDetailed.module.css";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Client } from "@/types/client";

interface Props {
  clientId: string;
}

export function ClientsDetailed({ clientId }: Props) {
  const client = mockClients.find((c) => c.id === clientId);

  if (!client) {
    return <div>Клієнта не знайдено</div>;
  }

  return <div className="pl-[10px] pr-[10px] pt-[76px]"></div>;
}
