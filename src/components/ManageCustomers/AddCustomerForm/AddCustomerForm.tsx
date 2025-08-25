"use client";
import { useEffect, useState } from "react";
import React from "react";
import styles from "./AddCustomerForm.module.css";
import { handleAddCustomer } from "@/api/users";
import { useUser } from "@/context/UserContextProvider";

interface AddCustomerModalProps {
  onClose: () => void;
  onSubmit: (newUser: any) => void;
}

export const AddCustomerModal = ({
  onClose,
  onSubmit,
}: AddCustomerModalProps) => {
  const [customerData, setCustomerData] = useState({
    login: "",
    password: "",
    role: "driver",
    full_name: "",
  });
  const { user } = useUser()
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if(user?.is_active) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken)
    }
  }, [user?.is_active])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCustomerData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCustomerClick = async () => {
    const isAllFilled = Object.values(customerData).every(
      (val) => val.trim() !== ""
    );
    if (!isAllFilled) {
      alert("Please, fill all the gaps");
      return;
    }

    try {
      const newUser = await handleAddCustomer(customerData, token!);
      onSubmit(newUser);
      setCustomerData({
        login: "",
        password: "",
        role: "driver",
        full_name: "",
      });
      onClose();
    } catch (err) {
      console.log(err);
      alert("Не вдалося додати користувача");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.addCrewForm}`}>
        <label className="text-xl mb-10 text-black">Новий користувач</label>

        <div className="space-y-3 mb-5">
          <label>
            <div className={styles.addCrewInputTitle}>Логін</div>
            <input
              type="text"
              name="login"
              placeholder="Логін"
              value={customerData.login}
              onChange={handleInputChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            />
          </label>

          <label>
            <div className={styles.addCrewInputTitle}>Пароль</div>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={customerData.password}
              onChange={handleInputChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            />
          </label>

          <label>
            <div className={styles.addCrewInputTitle}>Роль</div>
            <select
              name="role"
              value={customerData.role}
              onChange={handleInputChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            >
              <option value="driver">Driver</option>
              <option value="accountant">Accountant</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label>
            <div className={styles.addCrewInputTitle}>Повне ім'я</div>
            <input
              type="text"
              name="full_name"
              placeholder="Повне ім'я"
              value={customerData.full_name}
              onChange={handleInputChange}
              className="border-b-1 p-2 pb-1 outline-none w-full"
            />
          </label>
        </div>

        <div className="flex justify-end gap-5">
          <button
            onClick={onClose}
            className={`${styles.addCrewCancelBtn} rounded`}
          >
            Скасувати
          </button>
          <button
            onClick={handleAddCustomerClick}
            className={`${styles.addCrewButton} rounded`}
          >
            Додати
          </button>
        </div>
      </div>
    </div>
  );
};
