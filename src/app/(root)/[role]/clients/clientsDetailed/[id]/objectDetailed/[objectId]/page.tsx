import { ClientObjectSettings } from "@/components/Clients/ClientObject/ClientObjectSettings/ClientObjectSettings";
import React from "react";

interface Params {
  role: string;
  objectId: number;
}

interface Props {
  params: Promise<Params>;
}

export default async function ClientObjectSettingsPage({ params }: Props) {
  const awaitedParams = await params;

  return <ClientObjectSettings objectId={awaitedParams.objectId} />;
}
