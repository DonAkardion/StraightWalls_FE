import { fetcher } from "@/utils/fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface Payment {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  amount: number;
  status: "pending" | "paid" | "canceled";
  created_at: string;
  updated_at: string;
  project?: {
    id: number;
    name: string;
  };
}

export interface PaymentDraft {
  project_id: number;
  name: string;
  description?: string;
  amount: number;
  status?: "pending" | "paid" | "canceled";
}

// 1. GetAllProjectPayments by project ID
export async function getProjectPayments(
  projectId: number,
  token: string
): Promise<Payment[]> {
  return fetcher<Payment[]>(`${API_BASE}/api/payments/project/${projectId}`, {
    token,
  });
}

// 2. Get Payment by ID
export async function getPaymentById(
  id: number,
  token: string
): Promise<Payment> {
  return fetcher<Payment>(`${API_BASE}/api/payments/${id}`, { token });
}

// 3. Create New Payment
export async function createPayment(
  data: PaymentDraft,
  token: string
): Promise<Payment> {
  return fetcher<Payment>(`${API_BASE}/api/payments`, {
    method: "POST",
    data,
    token,
  });
}

// 4. Update Payment Status
export async function updatePaymentStatus(
  id: number,
  status: "pending" | "paid" | "canceled",
  token: string
): Promise<Payment> {
  return fetcher<Payment>(`${API_BASE}/api/payments/${id}/status`, {
    method: "PATCH",
    data: { status },
    token,
  });
}

// 5. Update Payment
export async function updatePayment(
  id: number,
  data: Partial<Omit<PaymentDraft, "project_id">>,
  token: string
): Promise<Payment> {
  return fetcher<Payment>(`${API_BASE}/api/payments/${id}`, {
    method: "PATCH",
    data,
    token,
  });
}

// 6. DELETE Payment
export async function deletePayment(id: number, token: string): Promise<void> {
  return fetcher<void>(`${API_BASE}/api/payments/${id}`, {
    method: "DELETE",
    token,
  });
}

// 7. Get Project Total Payments (can pass status)
export async function getProjectPaymentsSum(
  projectId: number,
  token: string,
  status?: "pending" | "paid" | "canceled"
): Promise<{ sum: number }> {
  return fetcher<{ sum: number }>(
    `${API_BASE}/api/payments/project/${projectId}/sum`,
    {
      token,
      params: status ? { status } : undefined,
    }
  );
}

// 8. Get Project Overdue Payments
export async function getProjectPaymentsOverdue(
  projectId: number,
  token: string
): Promise<Payment[]> {
  const response = await fetcher<{ status: string; data: Payment[] }>(
    `${API_BASE}/api/payments/project/${projectId}/overdue`,
    { token }
  );
  return response.data || [];
}
