"use client";
import React from "react";

import { mockClients } from "@/mock/Clients/clientsMock";

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
