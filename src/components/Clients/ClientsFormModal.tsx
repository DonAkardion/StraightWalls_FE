"use client";

import React, { useEffect, useState } from "react";
import { Client, ClientObject } from "@/types/client";
import { FormModal } from "@/components/Table/Form/FormModal";
import { ClientObjectFormModal } from "@/components/Clients/ClientObject/ClientObjectFormModal";
import { ClientObjectsList } from "@/components/Clients/ClientObject/ClientObjectsList";
import { deleteClientObject, addClientObject } from "@/api/clients";
import { useUser } from "@/context/UserContextProvider";

type NewClientForm = {
  full_name: string;
  phone_number: string;
  object: Pick<ClientObject, "name" | "address" | "description">;
};

interface Props {
  client?: Client;
  onChange: (data: Client | NewClientForm) => void;
  refreshClient?: (clientId?: number) => Promise<Client | undefined>;
}

export const ClientFormModal = ({ client, onChange, refreshClient }: Props) => {
  const isEdit = Boolean(client);
  const { token } = useUser();

  // create-mode form
  const [createForm, setCreateForm] = useState<NewClientForm>({
    full_name: client?.full_name || "",
    phone_number: client?.phone_number || "+380",
    object: {
      name: "",
      address: "",
      description: "",
    },
  });

  // edit-mode form (full Client object)
  const [editForm, setEditForm] = useState<Client | null>(client ?? null);

  // local UI state for adding object inline
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [newObject, setNewObject] = useState<
    Pick<ClientObject, "name" | "address" | "description">
  >({
    name: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    if (client) {
      setEditForm(client);
    } else {
      setEditForm(null);
      setCreateForm({
        full_name: "",
        phone_number: "+380",
        object: { name: "", address: "", description: "" },
      });
    }
  }, [client]);

  useEffect(() => {
    if (isEdit) {
      if (editForm) onChange(editForm);
    } else {
      onChange(createForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createForm, editForm, isEdit]);

  const [errors, setErrors] = useState<{ full_name?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditForm((prev) =>
        prev
          ? {
              ...prev,
              full_name: name === "full_name" ? value : prev.full_name,
              phone_number: name === "phone_number" ? value : prev.phone_number,
            }
          : prev
      );
    } else {
      setCreateForm((prev) =>
        name === "full_name"
          ? { ...prev, full_name: value }
          : { ...prev, phone_number: value }
      );
    }

    if (name === "full_name" && !value.trim()) {
      setErrors((prev) => ({ ...prev, full_name: "Ім’я є обов’язковим" }));
    } else if (name === "full_name") {
      setErrors((prev) => ({ ...prev, full_name: undefined }));
    }
  };

  const handleObjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!isEdit) {
      setCreateForm((prev) => ({
        ...prev,
        object: {
          ...prev.object,
          ...(name === "name" ? { name: value } : {}),
          ...(name === "address" ? { address: value } : {}),
          ...(name === "description" ? { description: value } : {}),
        },
      }));
    }
  };

  const handleSaveObject = async () => {
    if (!token || !client) return;
    await addClientObject(token, client.id, newObject);
    if (refreshClient) {
      const updated = await refreshClient(client.id);
      if (updated) setEditForm(updated);
    }
    setShowObjectModal(false);
  };

  return (
    <>
      <label className="block mb-3">
        <div>Ім’я</div>
        <input
          type="text"
          name="full_name"
          placeholder="Ім’я"
          value={isEdit ? editForm?.full_name ?? "" : createForm.full_name}
          onChange={handleChange}
          className={`border-b-1 p-2 pb-1 outline-none w-full ${
            errors.full_name ? "border-red-500" : "border-black"
          }`}
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
        )}
      </label>

      <label className="block mb-3">
        <div>Телефон</div>
        <input
          type="text"
          name="phone_number"
          placeholder="+380..."
          value={
            isEdit ? editForm?.phone_number ?? "" : createForm.phone_number
          }
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>

      {!isEdit && (
        <>
          <label className="block mb-3">
            <div>Назва Об’єкту</div>
            <input
              type="text"
              name="name"
              placeholder="Квартира, Офіс..."
              value={createForm.object.name}
              onChange={handleObjectChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            />
          </label>
          <label className="block mb-3">
            <div>Адреса</div>
            <input
              type="text"
              name="address"
              placeholder="вул. Шевченка, 10"
              value={createForm.object.address}
              onChange={handleObjectChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            />
          </label>
          <label className="block mb-3">
            <div>Опис</div>
            <input
              type="text"
              name="description"
              placeholder="Двокімнатна квартира..."
              value={createForm.object.description}
              onChange={handleObjectChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            />
          </label>
        </>
      )}

      {isEdit && editForm && (
        <div className="mt-3">
          <h6 className=" mb-2">Об’єкти клієнта</h6>
          <ClientObjectsList
            objects={editForm.objects}
            onAdd={() => setShowObjectModal(true)}
            onDelete={async (id) => {
              if (!token || !client) return;
              await deleteClientObject(token, id);
              if (refreshClient) {
                const updated = await refreshClient(client.id);
                if (updated) setEditForm(updated);
              }
            }}
          />
        </div>
      )}
      {showObjectModal && (
        <FormModal
          title="Додати об’єкт"
          onClose={() => setShowObjectModal(false)}
          onSave={handleSaveObject}
          isValid={Boolean(newObject.name && newObject.address)}
        >
          <ClientObjectFormModal
            object={undefined}
            onChange={(data) => setNewObject(data)}
          />
        </FormModal>
      )}
    </>
  );
};
