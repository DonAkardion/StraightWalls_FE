import React from "react";
import { ClientsDetailed } from "@/features/clients/ClientsDetailed/ClientsDetailed";

interface Params {
  role: string;
  id: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function ClientsDetailedPage({ params }: Props) {
  const awaitedParams = await params;

  return <ClientsDetailed clientId={awaitedParams.id} />;
}
