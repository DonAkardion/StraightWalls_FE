"use client";

import React, { useEffect, useState } from "react";
import { Table } from "../Table/Table";
import { ManageCustomersProps } from "@/types/manageCustomers";
import { ChangePasswordModal } from "./ChangePasswordModal/ChangePasswordModal";
import { handleDelete, handleEdit } from "@/utils/fetchRequests";
import { AddCustomerModal } from "./AddCustomerForm/AddCustomerForm";

interface ManageCustomerProps {
  onDelete: (id: number) => void;
}

export const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImxvZ2luIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJmdWxsTmFtZSI6ItCh0LjRgdGC0LXQvNC90LjQuSDQkNC00LzRltC90ZbRgdGC0YDQsNGC0L7RgCIsImlhdCI6MTc1NTYwMTI3MywiZXhwIjoxNzU1Njg3NjczfQ.tlgv5y1aJ9XPKKlYr_wmn3CQ28v9ydDDlsQ81HnGClQ";

export const ManageCustomers = ({ onDelete }: ManageCustomerProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [users, setUsers] = useState<ManageCustomersProps[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCustomerOpenModal, setIsCustomerOpenModal] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch("http://195.35.56.196:8000/api/platform/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return console.log("Error! The server didn't respond.");
    const data = await res.json();
    setUsers(data.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (id: number) => {
    setEditingId(id);
    setIsOpenModal(true);
  };

  const handleSavePassword = async (newPassword: string) => {
    if (!editingId) return;
    await handleEdit(editingId, newPassword);
    setIsOpenModal(false);
    setEditingId(null);
    setUsers((prev) =>
      prev.map((u) => (u.id === editingId ? { ...u, password: "********" } : u))
    );
  };

  const handleDeleteCustomer = async (id: number) => {
    await handleDelete(id);
    onDelete(id);
    fetchUsers();
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
