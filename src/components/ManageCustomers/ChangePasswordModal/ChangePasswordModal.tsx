import React, { useState } from "react";
import styles from "./ChangePasswordModal.module.css";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onSave: (newPassword: string) => void;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  isOpen,
  onSave,
  onClose,
}: ChangePasswordModalProps) => {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim() === "") return;
    onSave(newPassword);
    setNewPassword("");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <form onSubmit={handleSubmit} className={styles.modalContent}>
        <div className={styles.addCrewInputTitle}>Змінити пароль</div>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Новий пароль"
          className="border-b-1 p-2 pb-1 outline-none w-full"
        />
        <div className="flex justify-end gap-5 mt-5">
          <button className={`${styles.addCrewButton} rounded`} type="submit">
            Змінити пароль
          </button>
          <button
            className={`${styles.addCrewCancelBtn} rounded`}
            type="button"
            onClick={onClose}
          >
            Закрити
          </button>
        </div>
      </form>
    </div>
  );
};
