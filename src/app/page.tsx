import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const user = useUser();

  if (user.role === "admin") {
    redirect("/admin");
  } else if (user.role === "worker") {
    redirect("/worker");
  }

  redirect("/unauthorized");
}
