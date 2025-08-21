import { token } from "@/components/ManageCustomers/ManageCustomersList";

export const handleDelete = async (id: number) => {
  const res = await fetch(
    `http://195.35.56.196:8000/api/platform/users/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) console.log("Користувача видалено");
};

export const handleEdit = async (id: number, password: string) => {
  const res = await fetch(
    `http://195.35.56.196:8000/api/platform/users/${id}/password`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password }),
    }
  );
  if (res.ok) console.log("Пароль змінено");
};

export const handleAddCustomer = async (customerData: {
  login: string;
  password: string;
  role: string;
  full_name: string;
}) => {
  const res = await fetch("http://195.35.56.196:8000/api/platform/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  if (!res.ok) throw new Error("Не вдалося додати користувача");

  return await res.json();
};
