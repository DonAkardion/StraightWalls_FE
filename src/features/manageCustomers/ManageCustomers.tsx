"use client";
import React from "react";
import { ManageCustomersContainer } from "@/components/ManageCustomers/ManageCustomersContainer";
import { ManageCustomers } from "@/components/ManageCustomers/ManageCustomersList";
import { handleDelete } from "@/utils/fetchRequests";

export default function ManageCustomersPage() {
  return (
    <ManageCustomersContainer>
      <ManageCustomers onDelete={(id: number) => handleDelete(id)} />
    </ManageCustomersContainer>
  );
}
