import { Crew } from "@/types/crew";
import { fetcher } from "@/utils/fetcher";
import { Worker } from "@/types/worker";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getCrews = async (token: string): Promise<Crew[]> => {
  try {
    const response = await fetch("https://api.rivni-stiny.click/api/teams", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (response.status === 304) {
      console.log("Дані не змінились (304), можна використати локальний кеш");
      return [];
    }

    if (!response.ok) {
      console.log(`Помилка при отриманні бригад: ${response.status}`);
    }

    const data = await response.json();
    console.log("Бригади успішно отримані:", data);
    return data?.data || [];
  } catch (error) {
    console.error("Помилка getCrews:", error);
    return [];
  }
};

export const handleDeleteCrew = async (id: number, token: string) => {
  await fetcher(`${apiUrl}/api/teams/${id}`, {
    method: "DELETE",
    token,
  });
  console.log("Бригада була успішно видалена");
};

export const handleEditCrew = async (
  id: number,
  crewsData: Partial<Crew>,
  token: string
): Promise<Crew> => {
  const response = await fetcher<{ data: Crew }>(`${apiUrl}/api/teams/${id}`, {
    method: "PUT",
    token,
    data: crewsData,
  });
  console.log("Бригада була успішно оновлена");
  return response.data;
};

export const handleAddCrew = async (
  crewData: {
    name: string;
    status?: string | null;
  },
  token: string
): Promise<Crew> => {
  const response = await fetcher<{ data: Crew }>(`${apiUrl}/api/teams`, {
    method: "POST",
    token,
    data: crewData,
  });

  return response.data;
};

export async function handleGetCrewWorkers(
  team_id: number,
  token: string
): Promise<Worker[]> {
  const response = await fetcher<{ status: string; data: Worker[] }>(
    `${apiUrl}/api/workers/`,
    {
      method: "GET",
      token,
      params: { team_id },
    }
  );

  return response.data;
}
