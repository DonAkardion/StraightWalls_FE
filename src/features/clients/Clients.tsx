"use client";
import React, { useState, useEffect } from "react";
import styles from "./Clients.module.css";
import { useParams } from "next/navigation";
import { Client } from "@/types/client";
import { ClientsList } from "@/components/Clients/ClientsList";
import { ClientFormModal } from "@/components/Clients/ClientsFormModal";
import { FormModal } from "@/components/Table/Form/FormModal";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient as apiDeleteClient,
} from "@/api/clients";
import { useUser } from "@/context/UserContextProvider";

export function Clients() {
  const { role } = useParams();
  const roleStr = Array.isArray(role) ? role[0] : role;

  const { token } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalData, setModalData] = useState<{ client?: Client } | null>(null);
  const [currentForm, setCurrentForm] = useState<
    Omit<Client, "id" | "created_at" | "updated_at"> | Client | null
  >(null);

  // Завантаження клієнтів
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getClients(token);
        setClients(data);
      } catch (err) {
        console.error("Помилка при завантаженні клієнтів:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const deleteClient = async (id: number) => {
    if (!token) return;
    try {
      await apiDeleteClient(token, id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Помилка при видаленні клієнта:", err);
    }
  };

  const openEditModal = (client: Client) => {
    setModalData({ client });
    setCurrentForm(client);
  };

  const openAddModal = () => {
    const newClient: Omit<Client, "id" | "created_at" | "updated_at"> = {
      full_name: "",
      phone_number: "+380",
      objects: [],
    };
    setModalData({});
    setCurrentForm(newClient);
  };

  const saveClient = async (
    client: Client | Omit<Client, "id" | "created_at" | "updated_at">
  ) => {
    if (!token) return;
    try {
      let saved: Client;
      if ("id" in client && client.id) {
        saved = await updateClient(token, client.id, client);
        setClients((prev) => prev.map((c) => (c.id === client.id ? saved : c)));
      } else {
        saved = await createClient(
          token,
          client as Omit<Client, "id" | "created_at" | "updated_at">
        );
        setClients((prev) => [...prev, saved]);
      }
      setModalData(null);
      setCurrentForm(null);
    } catch (err) {
      console.error("Помилка при збереженні клієнта:", err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Завантаження...</div>;
  }

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[250px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[60px]`}
    >
      <ClientsList
        clients={clients}
        onDelete={deleteClient}
        onEdit={openEditModal}
        onAdd={openAddModal}
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
            if (
              "full_name" in currentForm &&
              currentForm.full_name &&
              currentForm.phone_number
            ) {
              saveClient(currentForm);
            }
          }}
          isValid={
            "full_name" in currentForm &&
            !!currentForm.full_name &&
            !!currentForm.phone_number
          }
        >
          <ClientFormModal
            client={"id" in currentForm ? (currentForm as Client) : undefined}
            onChange={(updated) => setCurrentForm(updated)}
          />
        </FormModal>
      )}
    </section>
  );
}
