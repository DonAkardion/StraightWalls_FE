"use client";
import React from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import { ClientsInitials } from "@/components/Clients/ClientsDetailed/ClientInitials/ClientsInitials";

interface Props {
  clientId: string;
}

export function ClientsDetailed({ clientId }: Props) {
  const client = mockClients.find((c) => c.id === clientId);

  if (!client) {
    return <div>Клієнта не знайдено</div>;
  }

  return <ClientsInitials client={client}/>;
}
