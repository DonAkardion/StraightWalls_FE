"use client";
import { useState, useEffect } from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import styles from "./Clients.module.css";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Client } from "@/types/client";
import { ClientsList } from "@/components/Clients/ClientsList";
import { ClientFormModal } from "@/components/Clients/ClientsFormModal";

export function Clients() {
  const { role } = useParams();
  const roleStr = Array.isArray(role) ? role[0] : role;
  const [clients, setClients] = useState<Client[]>(mockClients);
  const router = useRouter();

  const handleDelete = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  // modal window
  const [modalData, setModalData] = useState<{
    client?: Client;
  } | null>(null);

  const openEditModal = (client: Client) => {
    setModalData({ client });
  };

  const openAddModal = () => {
    setModalData({});
  };

  const handleSave = (newClient: Client) => {
    setClients((prev) => {
      const exists = prev.find((clients) => clients.id === newClient.id);
      if (exists) {
        return prev.map((c) => (c.id === newClient.id ? newClient : c));
      }

      return [...prev, { ...newClient }];
    });
    setModalData(null);
  };

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[250px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[60px]`}
    >
      <ClientsList
        clients={clients}
        onDelete={handleDelete}
        onEdit={openEditModal}
        onAdd={() => openAddModal()}
        role={roleStr}
      />
      {modalData && (
        <ClientFormModal
          client={modalData?.client}
          onClose={() => setModalData(null)}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
