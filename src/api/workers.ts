import { fetcher } from "@/utils/fetcher";
import { Worker } from "@/types/worker";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface WorkersResponse {
  status: string;
  data: Worker[];
}

export const handleAddWorker = async (
  workerData: {
    full_name: string;
    phone_number: string;
    position: string;
    team_id?: number | null;
  },
  token: string
): Promise<{ worker: Worker }> => {
  const response = await fetcher<{ data: Worker }>(`${apiUrl}/api/workers`, {
    method: "POST",
    token,
    data: workerData,
  });
  console.log("Воркер був успішно доданий")
  return { worker: response.data };
};

export const handleUpdateWorker = async (
  id: number,
  token: string,
  workerData: Partial<Worker>
) => {
  const response = await fetcher<{ data: Worker }>(`${apiUrl}/api/workers/${id}`, {
    method: "PUT",
    token,
    data: workerData,
  });
  console.log("Воркер був успішно оновлений");

  return response.data;
};

export const handleDeleteWorker = async (id: number, token: string) => {
    await fetcher(`${apiUrl}/api/workers/${id}`, {
      method: "DELETE",
      token
    }) 
    console.log("Воркер був успішно видалений")
}

export const getWorkers = async (token: string): Promise<Worker[]> => {
  const response = await fetcher(`${apiUrl}/api/workers`, {
    method: "GET",
    token,
  });

  console.log("Воркери успішно отримані:", response);

  const data = response as WorkersResponse;
  return data.data; 
};
