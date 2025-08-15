"use client";
import React from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import { ClientsInitials } from "@/components/Clients/ClientsDetailed/ClientInitials/ClientsInitials";
import { ClientsProjectsTable } from "@/components/Clients/ClientsDetailed/ClientsProjectsTable/ClientsProjectsTable";
import { ClientsBenefit } from "@/components/Clients/ClientsDetailed/ClientsBenefit/ClientsBenefit";
import { ClientsInteraction } from "@/components/Clients/ClientsDetailed/ClientInteraction/ClientInteraction";
import { ClientsContainer } from "@/components/Clients/ClientsDetailed/ClientsContainer";

interface Props {
  clientId: string;
}

export function ClientsDetailed({ clientId }: Props) {
  const client = mockClients.find((c) => c.id === clientId);

  if (!client) {
    return <div>Клієнта не знайдено</div>;
  }

  return (
    <ClientsContainer>
      <ClientsInitials client={client}/>
      <ClientsProjectsTable />
      <ClientsBenefit />
      <ClientsInteraction />
    </ClientsContainer>
  )
}
