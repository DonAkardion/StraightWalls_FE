"use client";
import React from "react";
import { useState } from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import styles from "./Clients.module.css";
import { useParams } from "next/navigation";
import { Client } from "@/types/client";
import { ClientsList } from "@/components/Clients/ClientsList";
import { ClientFormModal } from "@/components/Clients/ClientsFormModal";
import { FormModal } from "@/components/Table/Form/FormModal";
import { handleDelete, handleSave } from "@/utils/dataHandlers";

export function Clients() {
  const { role } = useParams();
  const roleStr = Array.isArray(role) ? role[0] : role;
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [modalData, setModalData] = useState<{ client?: Client } | null>(null);

  const [currentForm, setCurrentForm] = useState<Client | null>(null);
  const deleteClient = (id: string) => {
    setClients((prev) => handleDelete(prev, id));
  };

  const openEditModal = (client: Client) => {
    setModalData({ client });
    setCurrentForm(client);
  };

  const openAddModal = () => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      name: "",
      contactName: "",
      address: "",
      phone: "+380",
      mail: "",
    };
    setModalData({});
    setCurrentForm(newClient);
  };

  const saveClient = (client: Client) => {
    setClients((prev) => handleSave(prev, client));
    setModalData(null);
    setCurrentForm(null);
  };

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[250px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[60px]`}
    >
      <ClientsList
        clients={clients}
        onDelete={deleteClient}
        onEdit={openEditModal}
        onAdd={() => openAddModal()}
        role={roleStr}
      />
      {modalData && currentForm && (
        <FormModal
          title={modalData.client ? "Редагувати клієнта" : "Новий клієнт"}
          onClose={() => {
            setModalData(null);
            setCurrentForm(null);
          }}
          onSave={() => {
            if (currentForm.name && currentForm.phone) {
              saveClient(currentForm);
            }
          }}
          isValid={!!currentForm.name && !!currentForm.phone}
        >
          <ClientFormModal
            client={modalData.client}
            onChange={(updated) => setCurrentForm(updated)}
          />
        </FormModal>
      )}
    </section>
  );
}
