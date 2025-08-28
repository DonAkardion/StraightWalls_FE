"use client";
import React, { useEffect, useState } from "react";
import { ClientsInitials } from "@/components/Clients/ClientsDetailed/ClientInitials/ClientsInitials";
import { ClientsProjectsTable } from "@/components/Clients/ClientsDetailed/ClientsProjectsTable/ClientsProjectsTable";
import { ClientsBenefit } from "@/components/Clients/ClientsDetailed/ClientsBenefit/ClientsBenefit";
import { ClientsInteraction } from "@/components/Clients/ClientsDetailed/ClientInteraction/ClientInteraction";
import { ClientsContainer } from "@/components/Clients/ClientsDetailed/ClientsContainer";
import { Client } from "@/types/client";
import { getClientById } from "@/api/clients";
import { useUser } from "@/context/UserContextProvider";

interface Props {
  clientId: number;
}

export function ClientsDetailed({ clientId }: Props) {
  const { token } = useUser();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getClientById(token, clientId);
        setClient(data);
      } catch (err) {
        console.error("Помилка при завантаженні клієнта:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, clientId]);

  if (loading) {
    return (
      <div className="p-4 absolute top-[50%] left-[50%] ">Завантаження...</div>
    );
  }

  if (!client) {
    return (
      <div className="p-4 absolute top-[40%] right-[30%] ">
        Клієнта не знайдено
      </div>
    );
  }

  return (
    <ClientsContainer>
      <ClientsInitials client={client} />
      <ClientsProjectsTable clientId={clientId}/>
      <ClientsBenefit clientId={clientId}/>
      <ClientsInteraction />
    </ClientsContainer>
  );
}
