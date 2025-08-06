"use client";

import React, { useEffect, useState } from "react";
import { Client } from "@/types/client";

interface Props {
  client?: Client;
  onChange: (client: Client) => void;
}

export const ClientFormModal = ({ client, onChange }: Props) => {
  const [form, setForm] = useState<Client>(
    client || {
      id: crypto.randomUUID(),
      name: "",
      contactName: "",
      address: "",
      phone: "+380",
      mail: "",
    }
  );

  useEffect(() => {
    onChange(form);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <label>
        <div>Ім’я</div>
        <input
          type="text"
          name="name"
          placeholder="Ім’я"
          value={form.name}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
      <label>
        <div>Контактна особа</div>
        <input
          type="text"
          name="contactName"
          placeholder="Контактна особа"
          value={form.contactName}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
      <label>
        <div>Адреса</div>
        <input
          type="text"
          name="address"
          placeholder="Адреса"
          value={form.address}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
      <label>
        <div>Телефон</div>
        <input
          type="text"
          name="phone"
          placeholder="+380..."
          value={form.phone}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
      <label>
        <div>Пошта</div>
        <input
          type="email"
          name="mail"
          placeholder="example@mail.com"
          value={form.mail}
          onChange={handleChange}
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
      </label>
    </>
  );
};
