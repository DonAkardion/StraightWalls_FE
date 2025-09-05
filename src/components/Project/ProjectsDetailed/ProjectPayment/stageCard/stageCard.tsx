"use client";
import React, { useState } from "react";
import styles from "./stageCard.module.css";
import { Trash } from "../../../../../../public/icons";
import { ChevronDown } from "lucide-react";

interface StageCardProps {
  id: number;
  title: string;
  sum: string;
  description: string;
  status: "paid" | "pending" | "canceled";
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: "paid" | "pending" | "canceled") => void;
}
const statusMap: Record<string, string> = {
  paid: "Виконано",
  pending: "Очікує",
  canceled: "Скасовано",
};
const statusColorMap: Record<string, string> = {
  paid: styles.statusDone,
  pending: styles.statusInProgress,
  canceled: styles.statusCanceled,
};

export function StageCard({
  id,
  title,
  sum,
  description,
  status,
  onDelete,
  onStatusChange,
}: StageCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const statusClass = statusColorMap[status] || "";
  const translatedStatus = statusMap[status] || status;

  const handleStatusChange = (newStatus: "paid" | "pending" | "canceled") => {
    setIsOpen(false);
    if (newStatus !== status) {
      onStatusChange(id, newStatus);
    }
  };

  return (
    <div
      className={`${styles.stageCard} max-w-[468px] min-h-[270px] w-full mx-auto`}
    >
      <div
        className={`${styles.stageCardTytle} flex justify-between pt-[16px] pr-[12px] pb-[18px] pl-[22px]`}
      >
        <div className={styles.cardTytleName}>
          <span>{title}</span>
        </div>
        <div className={styles.cardTytleSum}>
          <span>{sum}</span>
        </div>
      </div>

      <div
        className={`${styles.stageCardBody} flex flex-col justify-between h-[210px] pt-[18px] pr-[8px] pb-[21px] pl-[16px]`}
      >
        <div className={`${styles.cardBodyDesc} pb-[22px] `}>
          <span>{description}</span>
        </div>
        <div
          className={`${styles.cardTytleStatus} flex justify-center relative`}
        >
          <div
            className={`${styles.statusIcon} rounded-full w-[24px] h-[24px] mr-[6px] ${statusClass}`}
          ></div>

          <div className="relative flex items-center">
            <button
              className="flex items-center space-x-1"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className={styles.statusText}>{translatedStatus}</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-md z-10">
                {(["pending", "paid", "canceled"] as const).map((opt) => (
                  <div
                    key={opt}
                    onClick={() => handleStatusChange(opt)}
                    className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                  >
                    {statusMap[opt]}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex absolute right-[10px] top-[2px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              title="Видалити"
            >
              <img
                src={Trash.src}
                alt="Delete"
                className={`${styles.TableItemIcon} w-[21px] h-[21px] cursor-pointer`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
