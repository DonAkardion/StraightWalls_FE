import { fetcher } from "@/utils/fetcher";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const handleAddWorker = async (
  workerData: {
    full_name: string;
    phone_number: string;
    position: string;
    team_id: any;
  },
  token: string
) => {
  const response = await fetcher<{ data: { worker: any } }>(
    `${apiUrl}/api/workers`,
    {
      method: "POST",
      token,
      data: workerData,
    }
  );
  return response;
};
