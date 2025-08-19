"use client"
import { ManageCustomersContainer } from "@/components/ManageCustomers/ManageCustomersContainer";
import { ManageCustomers } from "@/components/ManageCustomers/ManageCustomersList";
import { handleDelete } from "@/utils/fetchRequests";

export default function ManageCustomersPage() {
    return (
        <ManageCustomersContainer>
            <ManageCustomers 
                onDelete={(id: string) => handleDelete(id)} 
            />
        </ManageCustomersContainer>
    )
}
