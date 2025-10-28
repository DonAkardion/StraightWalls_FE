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
  onChange: (data: Client | NewClientForm, isValid: boolean) => void;
  refreshClient?: (clientId?: number) => Promise<Client | undefined>;
}

export const ClientFormModal = ({ client, onChange, refreshClient }: Props) => {
  const isEdit = Boolean(client);
  const { token } = useUser();

  // create-mode form
  const [createForm, setCreateForm] = useState<NewClientForm>({
    full_name: client?.full_name || "",
    phone_number: client?.phone_number || "+380",
    object: { name: "", address: "", description: "" },
  });

  // edit-mode form (full Client object)
  const [editForm, setEditForm] = useState<Client | null>(client ?? null);

  // local UI state for adding object inline
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [newObject, setNewObject] = useState<
    Pick<ClientObject, "name" | "address" | "description">
  >({ name: "", address: "", description: "" });

  const [errors, setErrors] = useState<{
    full_name?: string;
    objectName?: string;
    objectAddress?: string;
  }>({});
  const [touched, setTouched] = useState<{
    full_name?: boolean;
    objectName?: boolean;
    objectAddress?: boolean;
  }>({});

  useEffect(() => {
    if (isEdit) return;

    const { full_name, phone_number, object } = createForm;

    if (object.address.trim() && full_name.trim() && phone_number.trim()) {
      const autoName = `${object.address}, ${full_name}, ${phone_number}`;
      setCreateForm((prev) => ({
        ...prev,
        object: { ...prev.object, name: autoName },
      }));
    }
  }, [
    createForm.full_name,
    createForm.phone_number,
    createForm.object.address,
    isEdit,
  ]);

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
    setErrors({});
    setTouched({});
  }, [client]);

  // валідація
  useEffect(() => {
    const newErrors: {
      full_name?: string;
      objectName?: string;
      objectAddress?: string;
    } = {};
    if (!(isEdit ? editForm?.full_name : createForm.full_name)?.trim()) {
      newErrors.full_name = "Поле імені обов'язкове";
    }

    if (!isEdit) {
      if (!createForm.object.name.trim())
        newErrors.objectName = "Поле назви об’єкту обов'язкове";
      if (!createForm.object.address.trim())
        newErrors.objectAddress = "Поле адреси обов'язкове";
    }

    setErrors(newErrors);
    onChange(
      isEdit ? editForm! : createForm,
      Object.keys(newErrors).length === 0
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createForm, editForm, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    } else {
      setCreateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleObjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!isEdit) {
      setCreateForm((prev) => ({
        ...prev,
        object: { ...prev.object, [name]: value },
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    if (name === "full_name")
      setTouched((prev) => ({ ...prev, full_name: true }));
    if (name === "name") setTouched((prev) => ({ ...prev, objectName: true }));
    if (name === "address")
      setTouched((prev) => ({ ...prev, objectAddress: true }));
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
          onBlur={handleBlur}
          className={`border-b-1 p-2 pb-1 outline-none w-full ${
            touched.full_name && errors.full_name
              ? "border-red-500"
              : "border-black"
          }`}
        />
        {touched.full_name && errors.full_name && (
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
          {/* <label className="block mb-3">
            <div>Назва Об’єкту</div>
            <input
              type="text"
              name="name"
              placeholder="Квартира, Офіс..."
              value={createForm.object.name}
              onChange={handleObjectChange}
              onBlur={handleBlur}
              className={`border-b-1 p-2 pb-1 outline-none w-full ${
                touched.objectName && errors.objectName
                  ? "border-red-500"
                  : "border-black"
              }`}
            />
            {touched.objectName && errors.objectName && (
              <p className="text-red-500 text-sm mt-1">{errors.objectName}</p>
            )}
          </label> */}
          <label className="block mb-3">
            <div>Адреса</div>
            <input
              type="text"
              name="address"
              placeholder="вул. Шевченка, 10"
              value={createForm.object.address}
              onChange={handleObjectChange}
              onBlur={handleBlur}
              className={`border-b-1 p-2 pb-1 outline-none w-full ${
                touched.objectAddress && errors.objectAddress
                  ? "border-red-500"
                  : "border-black"
              }`}
            />
            {touched.objectAddress && errors.objectAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.objectAddress}
              </p>
            )}
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
