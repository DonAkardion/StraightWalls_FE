"use client";
import React, { useState } from "react";
import styles from "@/components/Project/ProjectsDetailed/ProjectPayment/ProjectPayment.module.css";

export interface ProjectPaymentData {
  name: string;
  description?: string;
  amount: number;
  status: "pending" | "paid" | "canceled";
  due_date: string;
}

interface ProjectPaymentFormProps {
  onSubmit: (payment: ProjectPaymentData) => void;
  onCancel?: () => void;
}

export function ProjectPaymentForm({
  onSubmit,
  onCancel,
}: ProjectPaymentFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [status, setStatus] = useState<"pending" | "paid" | "canceled">(
    "pending"
  );
  const [dueDate, setDueDate] = useState("");

  const handleSave = () => {
    if (!name || !amount || !dueDate) {
      alert("Будь ласка, заповніть всі обов'язкові поля: назва, сума, дата");
      return;
    }

    const formattedDate = new Date(dueDate).toISOString().split("T")[0];

    const payment: ProjectPaymentData = {
      name,
      description,
      amount: Number(amount),
      status,
      due_date: formattedDate,
    };

    onSubmit(payment);
    setName("");
    setDescription("");
    setAmount("");
    setStatus("pending");
    setDueDate("");
  };

  return (
    <div
      className={`${styles.paymentForm} flex flex-col gap-4 mb-8 rounded-[5px]`}
    >
      <div
        className={`${styles.paymentFormTitle} flex items-center pl-[36px] w-full h-[76px] rounded-[5px]`}
      >
        <h3>Створити платіж</h3>
      </div>

      <div
        className={`${styles.paymentFormContent} flex flex-col items-center gap-6 p-4`}
      >
        <div className="flex flex-col md:flex-row md:gap-[40px] gap-[20px] w-full">
          <div className="flex flex-row w-full gap-[20px]">
            <h5 className={`${styles.paymentFormItemTitle} pt-2 min-w-[60px]`}>
              Назва
            </h5>
            <input
              type="text"
              placeholder="Назва платежу"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.editInput}
            />
          </div>
          <div className="flex flex-row w-full gap-[20px]">
            <h5 className={`${styles.paymentFormItemTitle} pt-2 min-w-[60px]`}>
              Сума
            </h5>
            <input
              type="number"
              placeholder="Сума платежу"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              min={0}
              className={styles.editInput}
            />
          </div>
        </div>

        <div className="flex flex-row w-full gap-[20px]">
          <h5 className={`${styles.paymentFormItemTitle} pt-2 min-w-[60px]`}>
            Опис
          </h5>
          <input
            type="text"
            placeholder="Опис платежу"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.editInput}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
          <div className="flex flex-row  gap-4 w-full">
            <div className=" flex flex-row gap-4 max-w-1/2 min-w-[170px] ">
              <h5
                className={`${styles.paymentFormItemTitle} pt-2 min-w-[64px] `}
              >
                Статус
              </h5>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "pending" | "paid" | "canceled")
                }
                className={`${styles.editInputSelect}  rounded-[5px] border-1 cursor-pointer`}
              >
                <option
                  className="cursor-pointer text-blue-400"
                  value="pending"
                >
                  Очікує
                </option>
                <option className="cursor-pointer text-green-400" value="paid">
                  Сплачено
                </option>
              </select>
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`${styles.editInput} max-w-1/3 min-w-[100px] cursor-pointer `}
            />
          </div>
          <div className=" flex justify-center md:justify-end md:mt-0 mt-[16px] w-full">
            <button
              onClick={handleSave}
              className={`${styles.paymentFormConfirmBtn} px-4 py-1 md:w-[60%] w-[40%] h-[40px] rounded-[5px] cursor-pointer`}
            >
              Зберегти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
