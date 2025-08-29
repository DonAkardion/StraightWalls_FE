"use client";
import React, { useState } from "react";
import styles from "@/components/Project/ProjectsDetailed/ProjectPayment/ProjectPayment.module.css";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

interface PaymentDetailItem {
  label: string;
  value: string | number;
}

interface PaymentData {
  name: string;
  description?: string;
  amount: number;
  status: "pending" | "paid" | "canceled";
  due_date: string;
}

interface PaymentDetailsProps {
  title?: string;
  items: PaymentDetailItem[];
  editable?: boolean;
  onChange?: (data: PaymentData) => void;
}

export function PaymentDetails({
  title = "Оплата:",
  items,
  editable = true,
  onChange,
}: PaymentDetailsProps) {
  const [name, setName] = useState("Аванс");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [status, setStatus] = useState<"pending" | "paid">("pending");
  const [dueDate, setDueDate] = useState("");

  const { setInitialPayment, setAdvanceAmount } = useProjectCreation();

  const buildPayment = (): PaymentData => ({
    name,
    description,
    amount: amount === "" ? 0 : amount,
    status,
    due_date: dueDate,
  });

  const handleConfirm = () => {
    const data = buildPayment();
    setInitialPayment({
      ...data,
      amount: String(data.amount),
    });
    setAdvanceAmount(data.amount);
    onChange?.(data);
  };

  return (
    <div className={`${styles.generalStatsDatailed}`}>
      <h2 className={`${styles.datailedTytle} mb-[16px]`}>{title}</h2>

      {/* Якщо editable=true → форма для створення платежу */}

      {editable && (
        <div
          className={`${styles.paymentForm} flex flex-col gap-4 mb-4 rounded-[5px]`}
        >
          <div
            className={`${styles.paymentFormTitle} flex items-center pl-[36px] w-full h-[76px] rounded-[5px]`}
          >
            <h3>Створити платіж</h3>
          </div>
          <div
            className={`${styles.paymentFormContent} flex flex-col items-center gap-6 p-4`}
          >
            <div className=" flex flex-row gap-[40px] w-full">
              <div className="flex flex-row w-full gap-[20px]">
                <h5
                  className={`${styles.paymentFormItemTitle} pt-2 min-w-[60px] `}
                >
                  Назва
                </h5>
                <input
                  type="text"
                  placeholder="Назва платежу"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${styles.editInput}`}
                />
              </div>
              <div className="flex flex-row w-full gap-[20px]">
                <h5
                  className={`${styles.paymentFormItemTitle} pt-2 min-w-[60px] `}
                >
                  Сума
                </h5>
                <input
                  type="number"
                  placeholder="Сума платежу"
                  value={amount === 0 ? "" : amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setAmount(0);
                    } else {
                      setAmount(Number(val));
                    }
                  }}
                  min={0}
                  className={`${styles.editInput}`}
                />
              </div>
            </div>
            <div className="flex flex-row w-full gap-[20px]">
              <h5
                className={`${styles.paymentFormItemTitle} pt-2 min-w-[60px]`}
              >
                Опис
              </h5>
              <input
                type="text"
                placeholder="Опис платежу"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${styles.editInput}`}
              />
            </div>
            <div className="flex flex-row justify-between gap-4 w-full ">
              <h5
                className={`${styles.paymentFormItemTitle} pt-2 min-w-[64px] `}
              >
                Статус
              </h5>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "pending" | "paid")
                }
                className={`${styles.editInputSelect} w-[40%] rounded-[5px] border-1`}
              >
                <option className=" text-blue-400" value="pending">
                  Очікує
                </option>
                <option className=" text-green-400" value="paid">
                  Сплачено
                </option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`${styles.editInput}`}
              />
              <button
                onClick={handleConfirm}
                className={`${styles.paymentFormConfirmBtn} px-4 py-1 w-[40%] h-[40px] rounded-[5px]`}
              >
                Підтвердити
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`${styles.datailedList} flex flex-col gap-[16px]`}>
        {items.map((item, idx) => (
          <div key={idx} className={`${styles.datailedListItem}`}>
            <span className={`${styles.datailedListItemText}`}>
              {item.label}
            </span>
            <span className={`${styles.datailedListItemSum}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
