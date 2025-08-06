"use client";

import React from "react";
import styles from "./FormModal.module.css";
interface FormModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
  isValid?: boolean;
}

export const FormModal = ({
  title,
  children,
  onClose,
  onSave,
  isValid = true,
}: FormModalProps) => {
  return (
    <div
      className={`${styles.ModalOverlay} fixed inset-0 lg:right-[calc(1%-311px)] bg-opacity-40 flex items-center justify-center z-30`}
    >
      <div
        className={`${styles.ModalWindow} bg-white rounded-[5px] md:p-6 p-4 w-[90%] max-w-md`}
      >
        <h3 className={styles.ModalTitle}>{title}</h3>
        <div className="flex flex-col md:gap-3 gap-2 p-2">{children}</div>
        <div className="flex justify-end md:mt-4 mt-2 gap-4">
          <button
            onClick={onClose}
            className={`${styles.CancelBtn} px-4 py-2 rounded`}
          >
            Скасувати
          </button>
          <button
            onClick={onSave}
            className={`${styles.SaveBtn} px-4 py-2 rounded`}
            disabled={!isValid}
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};
