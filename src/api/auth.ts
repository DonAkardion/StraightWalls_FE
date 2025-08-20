import { fetcher } from "@/utils/fetcher";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOGIN_URL = `${API_URL}/api/platform/auth/login`;

export interface LoginResponse {
  user: {
    id: number;
    login: string;
    role: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  token: string;
  expires_in: string;
}

export async function loginUser(
  login: string,
  password: string
): Promise<LoginResponse> {
  // fetcher automatically handles JSON stringify and errors
  const response = await fetcher<{ data: LoginResponse }>(LOGIN_URL, {
    method: "POST",
    data: { login, password }, // directly send login & password
  });

  return response.data;
}
