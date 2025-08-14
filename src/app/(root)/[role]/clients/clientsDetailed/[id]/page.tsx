import { ClientsInteraction } from "../../../../../../components/Clients/ClientsDetailed/ClientInteraction/ClientInteraction";
import { ClientsBenefit } from "../../../../../../components/Clients/ClientsDetailed/ClientsBenefit/ClientsBenefit";
import { ClientsContainer } from "../../../../../../components/Clients/ClientsDetailed/ClientsContainer";
import { ClientsProjectsTable } from "../../../../../../components/Clients/ClientsDetailed/ClientsProjectsTable/ClientsProjectsTable";
import { ClientsDetailed } from "../../../../../../features/clients/ClientsDetailed/ClientsDetailed";
import React from "react";


interface Params {
  role: string;
  id: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function ClientsDetailedPage({ params }: Props) {
  const awaitedParams = await params;

  return (
    <ClientsContainer>
      <ClientsDetailed clientId={awaitedParams.id} />
      <ClientsProjectsTable />
      <ClientsBenefit />
      <ClientsInteraction />
    </ClientsContainer>
  );
}
