import { fetcher } from "@/utils/fetcher";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const handleDelete = async (id: string, token: string): Promise<void> => {
    await fetcher(`${apiUrl}/api/platform/users/${id}`, {
        method: "DELETE",
        token
    })
    console.log("Користувача успішно видалено")
}

export const handleEdit = async (id: string, password: string, token: string) => {
    await fetcher<void>(`${apiUrl}/api/platform/users/${id}/password`, {
        method: "PATCH",
        token,
        data: { password }
    })
    console.log("Пароль користувача успішно змінено")
}

export const handleAddCustomer = async (
  customerData: {
    login: string;
    password: string;
    role: string;
    full_name: string;
  },
  token: string | undefined) => {
    const response = await fetcher<{ data: { user: any } }>(`${apiUrl}/api/platform/users`, {
        method: "POST",
        token,
        data: customerData
    })
    console.log("Користувач успішно доданий")
    return response
  }