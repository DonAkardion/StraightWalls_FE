import { ClientsDetailed } from "@/features/clients/ClientsDetailed/ClientsDetailed";
import React from "react";
import { ClientsInteraction } from "../../../../../../components/Clients/ClientsDetailed/ClientInteraction/ClientInteraction";
import { ClientsBenefit } from "@/components/Clients/ClientsDetailed/ClientsBenefit/ClientsBenefit";
import { ClientsProjectsTable } from "../../../../../../components/Clients/ClientsDetailed/ClientsProjectsTable/ClientsProjectsTable";

interface Params {
  role: string;
  id: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function ClientsDetailedPage({ params }: Props) {
  const awaitedParams = await params;

  return(
    <div>
        <ClientsDetailed clientId={awaitedParams.id} />
        <ClientsProjectsTable />
        <ClientsBenefit />
        <ClientsInteraction />
    </div>
  )
}
