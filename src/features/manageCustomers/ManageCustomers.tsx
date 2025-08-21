"use client"
import { ManageCustomersContainer } from "@/components/ManageCustomers/ManageCustomersContainer";
import { ManageCustomers } from "@/components/ManageCustomers/ManageCustomersList";


export default function ManageCustomersPage() {
    return (
        <ManageCustomersContainer>
            <ManageCustomers />
        </ManageCustomersContainer>
    )
}
