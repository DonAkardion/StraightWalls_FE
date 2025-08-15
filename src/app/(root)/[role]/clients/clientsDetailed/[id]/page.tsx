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

  return <ClientsDetailed clientId={awaitedParams.id} />

}
