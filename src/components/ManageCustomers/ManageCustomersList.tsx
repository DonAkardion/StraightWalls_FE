"use client"

import { useEffect, useState } from "react";
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [users, setUsers] = useState<ManageCustomersProps[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCustomerOpenModal, setIsCustomerOpenModal] = useState(false);

  useEffect(() => {
    if (user?.isAuthenticated) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, [user?.isAuthenticated]);

  async function fetchUsers() {
    try {
      const data = await fetcher<{ data: { users: ManageCustomersProps[] } }>(
        `${apiUrl}/api/platform/users`,
        { token: token || undefined }
      );
      console.log("Fetched users:", data);
      setUsers(data.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleOpenModal = (id: string) => {
    setEditingId(id);
    setIsOpenModal(true);
  };

  const handleSavePassword = async (newPassword: string) => {
    if (!editingId) return;
    await handleEdit(editingId, newPassword, token!);
    setIsOpenModal(false);
    setEditingId(null);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingId ? { ...u, password: "********" } : u
      )
    );
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      handleDelete(id, token!);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error)
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
          {
            key: "login",
            label: "Логін користувача",
            tooltip: (user) => `Логін користувача: ${user.login}`,
          },
          { key: "password", label: "Пароль користувача" },
          {
            key: "role",
            label: "Роль користувача",
            tooltip: (user) => `Роль користувача: ${user.role}`,
          },
          {
            key: "full_name",
            label: "Ім'я користувача",
            tooltip: (user) => `Повне ім'я користувача: ${user.full_name}`,
          },
        ]}
        showIndex={true}
        onAdd={() => setIsCustomerOpenModal(true)}
        onDelete={(item) => handleDeleteCustomer(item.id)}
        onEdit={(user) => handleOpenModal(user.id)}
        className=""
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
