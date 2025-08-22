"use client";

import React, { useEffect, useState } from "react";
import { Table } from "../Table/Table";
import { ManageCustomersProps } from "@/types/manageCustomers";
import { ChangePasswordModal } from "./ChangePasswordModal/ChangePasswordModal";
import { AddCustomerModal } from "./AddCustomerForm/AddCustomerForm";
import { fetcher } from "@/utils/fetcher";
import { useUser } from "@/context/UserContextProvider";
import { handleEdit } from "@/api/users";
import { handleDelete } from "@/utils/dataHandlers";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const ManageCustomers = () => {
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [users, setUsers] = useState<ManageCustomersProps[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCustomerOpenModal, setIsCustomerOpenModal] = useState(false);

  useEffect(() => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }, [user]);

  // Fetch users
  const fetchUsers = async () => {
    if (!token) return;
    try {
      const data = await fetcher<{ data: { users: ManageCustomersProps[] } }>(
        `${apiUrl}/api/platform/users`,
        { token }
      );
      setUsers(data.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleOpenModal = (id: number) => {
    setEditingId(id);
    setIsOpenModal(true);
  };

  const handleSavePassword = async (newPassword: string) => {
    if (editingId === null || !token) return;
    await handleEdit(editingId, newPassword, token);
    setIsOpenModal(false);
    setEditingId(null);
    setUsers((prev) =>
      prev.map((u) => (u.id === editingId ? { ...u, password: "********" } : u))
    );
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!token) return;
    try {
      await handleDelete(id, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCustomerAdd = (response: any) => {
    const newUser = response.data.user;
    setUsers((prev) => [...prev, newUser]);
    setIsCustomerOpenModal(false);
  };

  return (
    <div>
      <Table<ManageCustomersProps>
        title="Користувачі"
        data={users}
        expandedId={expandedId}
        columns={[
          { key: "login", label: "Логін користувача", tooltip: (u) => `Логін користувача: ${u.login}` },
          { key: "password", label: "Пароль користувача" },
          { key: "role", label: "Роль користувача", tooltip: (u) => `Роль користувача: ${u.role}` },
          { key: "full_name", label: "Ім'я користувача", tooltip: (u) => `Повне ім'я користувача: ${u.full_name}` },
        ]}
        showIndex
        onAdd={() => setIsCustomerOpenModal(true)}
        onDelete={(item) => handleDeleteCustomer(item.id)}
        onEdit={(user) => handleOpenModal(user.id)}
        addButtonText="Додати робітника"
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
      />

      {isOpenModal && (
        <ChangePasswordModal
          isOpen={isOpenModal}
          onSave={handleSavePassword}
          onClose={() => setIsOpenModal(false)}
        />
      )}

      {isCustomerOpenModal && (
        <AddCustomerModal
          onSubmit={handleCustomerAdd}
          onClose={() => setIsCustomerOpenModal(false)}
        />
      )}
    </div>
  );
};
