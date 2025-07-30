import { useMemo } from "react";

// Тимчасова заглушка: симулює авторизованого користувача
export function useUser() {
  const user = useMemo(() => {
    return {
      name: "Олексій",
      role: "admin", // 🔁 Змініть на "worker", щоб перевірити
      isAuthenticated: true,
    };
  }, []);

  return user;
}
