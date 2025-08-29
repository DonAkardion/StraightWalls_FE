"use client";

import React, { useEffect, useState } from "react";
import { Client, ClientObject } from "@/types/client";

type NewClientForm = {
  full_name: string;
  phone_number: string;
  object: Pick<ClientObject, "name" | "address" | "description">;
};

interface Props {
  client?: Client;
  onChange: (data: Client | NewClientForm) => void;
}

export const ClientFormModal = ({ client, onChange }: Props) => {
  const isEdit = Boolean(client);

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

  // keep editForm in sync when client prop changes (opening edit modal)
  useEffect(() => {
    if (client) {
      setEditForm(client);
    } else {
      setEditForm(null);
      // optionally keep createForm values if desired
      setCreateForm((prev) => ({
        ...prev,
        full_name: "",
        phone_number: "+380",
        object: { name: "", address: "", description: "" },
      }));
    }
  }, [client]);

  // notify parent on changes
  useEffect(() => {
    if (isEdit) {
      if (editForm) onChange(editForm);
    } else {
      onChange(createForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createForm, editForm, isEdit]);

  const [errors, setErrors] = useState<{ full_name?: string }>({});

  // input handler for full_name and phone_number
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEdit) {
      // update editForm (Client) — we only expect name to be 'full_name' or 'phone_number'
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

    // простенька валідація
    if (name === "full_name" && !value.trim()) {
      setErrors((prev) => ({ ...prev, full_name: "Ім’я є обов’язковим" }));
    } else if (name === "full_name") {
      setErrors((prev) => ({ ...prev, full_name: undefined }));
    }
  };

  // handlers for object fields (only for create mode)
  const handleObjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!isEdit) {
      setCreateForm((prev) => ({
        ...prev,
        object: {
          ...prev.object,
          // name is "name" | "address" | "description"
          ...(name === "name" ? { name: value } : {}),
          ...(name === "address" ? { address: value } : {}),
          ...(name === "description" ? { description: value } : {}),
        },
      }));
    }
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
            <div>Назва Об`єкту</div>
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
    </>
  );
};
