"use client";
import { useEffect, useState } from "react";
import { Client } from "@/types/client";
import styles from "./ClientsFormModal.module.css";

interface Props {
  client?: Client;
  onClose: () => void;
  onSave: (data: Client) => void;
}

export const ClientFormModal = ({ client, onClose, onSave }: Props) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    onSave(form);
    onClose();
  };

  return (
    <div
      className={`${styles.ClientModal} pl-[12px] lg:pl-[60px] xl:pl[10px] fixed inset-0 bg-opacity-40 flex items-center justify-center z-30`}
    >
      <div
        className={`${styles.ClientModalWindow} bg-white rounded-[5px] md:p-6 p-4 w-[90%] max-w-md `}
      >
        <h3 className={`${styles.ClientModalWindowTytle}  `}>
          {client ? "Редагувати клієнта" : "Новий клієнт"}
        </h3>
        <div className="flex flex-col md:gap-3 gap-2 p-2">
          <div className={`${styles.ClientModalInputTytle}`}>Ім’я</div>
          <input
            type="text"
            name="name"
            placeholder="Ім’я"
            value={form.name}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
          <div className={`${styles.ClientModalInputTytle}`}>
            Контактна особа
          </div>
          <input
            type="text"
            name="contactName"
            placeholder="Контактна особа"
            value={form.contactName}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
          <div className={`${styles.ClientModalInputTytle}`}>Адреса</div>
          <input
            type="text"
            name="address"
            placeholder="Адреса"
            value={form.address}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
          <div className={`${styles.ClientModalInputTytle}`}>Телефон</div>
          <input
            type="text"
            name="phone"
            placeholder="+380..."
            value={form.phone}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
          <div className={`${styles.ClientModalInputTytle}`}>Пошта</div>
          <input
            type="email"
            name="mail"
            placeholder="example@mail.com"
            value={form.mail}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
        </div>
        <div className="flex justify-end md:mt-4 mt-2 gap-4">
          <button
            onClick={onClose}
            className={`${styles.ClientModalCancelBtn} px-4 py-2  rounded`}
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            className={`${styles.ClientModalSaveBtn} px-4 py-2 rounded`}
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};
