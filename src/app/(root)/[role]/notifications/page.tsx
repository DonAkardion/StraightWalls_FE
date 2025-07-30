import { Notifications } from "@/components/Notifications/Notifications";

export default function NotificationsPage() {
  return <Notifications />;
}

// Опційно — для SSG
export async function generateStaticParams() {
  return [{ role: "admin" }, { role: "worker" }];
}
