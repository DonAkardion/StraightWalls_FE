"use client";
import { useParams } from "next/navigation";
import styles from "./Notifications.module.css";
import { Notification } from "@/components/Notifications/components/Notification";

export function Notifications() {
  const params = useParams();
  const role = params.role as string;

  return (
    <section
      className={`${styles.notifications} lg:pt-[86px] lg:pl-[80px] lg:pr-[60px]`}
    >
      {/* <h1>{role}</h1> */}
      <div className={styles.notificationsList}>
        <Notification />
        <Notification />
      </div>
    </section>
  );
}
