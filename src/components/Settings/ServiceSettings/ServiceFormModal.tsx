"use client";
import { useEffect, useState } from "react";
import { Service, ServiceType } from "@/types/service";
import styles from "./ServiceFormModal.module.css";

interface Props {
  service?: Service;
  type: ServiceType;
  onClose: () => void;
  onSave: (data: Service) => void;
}

export const ServiceFormModal = ({ service, type, onClose, onSave }: Props) => {
  const [form, setForm] = useState<Service>(
    service || {
      id: crypto.randomUUID(),
      name: "",
      unit: "",
      price: 0,
      amount: 1,
      serviceType: type,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.unit) return;
    onSave(form);
    onClose();
  };

  return (
    <div
      className={`${styles.ServiceModal} pl-[12px] lg:pl-[60px] xl:pl[10px] fixed inset-0 bg-opacity-40 flex items-center justify-center z-30`}
    >
      <div
        className={`${styles.ServiceModalWindow} bg-white rounded-[5px] md:p-6 p-4 w-[90%] max-w-md `}
      >
        <h3 className={`${styles.ServiceModalWindowTytle}  `}>
          {service ? "Редагувати послугу" : "Нова послуга"}
        </h3>
        <div className="flex flex-col md:gap-3 gap-2 p-2">
          <div className={`${styles.ServiceModalInputTytle}`}>
            Назва послуги
          </div>
          <input
            type="text"
            name="name"
            placeholder="Назва"
            value={form.name}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
          <div className={`${styles.ServiceModalInputTytle}`}>
            Одиниці виміру
          </div>
          <input
            type="text"
            name="unit"
            placeholder="Одиниця виміру"
            value={form.unit}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
          <div className={`${styles.ServiceModalInputTytle}`}>
            Ціна за одиницю
          </div>
          <input
            type="number"
            name="price"
            placeholder="Ціна"
            value={form.price}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
          <div className={`${styles.ServiceModalInputTytle}`}>Кількість</div>
          <input
            type="number"
            name="amount"
            placeholder="Кількість"
            value={form.amount}
            onChange={handleChange}
            className="border-b-1 p-2 pb-1 outline-none"
          />
        </div>
        <div className="flex justify-end md:mt-4 mt-2 gap-4">
          <button
            onClick={onClose}
            className={`${styles.ServiceModalCancelBtn} px-4 py-2  rounded`}
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            className={`${styles.ServiceModalSaveBtn} px-4 py-2 rounded`}
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};
