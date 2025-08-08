"use client";
import { useEffect, useState } from "react";
import { Service, ServiceType } from "@/types/service";
import styles from "./ServiceFormModal.module.css";

interface Props {
  service: Service;
  onChange: (data: Service) => void;
}

export const ServiceFormModal = ({ service, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...service,
      [name]: name === "price" || name === "amount" ? parseFloat(value) : value,
    });
  };

  return (
    <div className="flex flex-col md:gap-3 gap-2 p-2">
      <div className={`${styles.ServiceModalInputTytle}`}>Назва послуги</div>
      <input
        type="text"
        name="name"
        placeholder="Назва"
        value={service.name}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />

      <div className={`${styles.ServiceModalInputTytle}`}>Одиниці виміру</div>
      <input
        type="text"
        name="unit"
        placeholder="Одиниця виміру"
        value={service.unit}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
      />

      <div className={`${styles.ServiceModalInputTytle}`}>Ціна за одиницю</div>
      <input
        type="number"
        name="price"
        placeholder="Ціна"
        value={service.price}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
        min={0}
      />

      <div className={`${styles.ServiceModalInputTytle}`}>Кількість</div>
      <input
        type="number"
        name="amount"
        placeholder="Кількість"
        value={service.amount}
        onChange={handleChange}
        className="border-b-1 p-2 pb-1 outline-none"
        min={0}
      />
    </div>
  );
};
