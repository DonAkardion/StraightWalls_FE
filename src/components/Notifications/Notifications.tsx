"use client";
import { useParams } from "next/navigation";
import styles from "./Notifications.module.css";
import { Notification } from "@/components/Notifications/components/Notification";

export function Notifications() {
  const params = useParams();
  const role = params.role as string;

  return (
    <section
      className={`${styles.notifications} max-w-[1126px] m-auto pt-[50px] pl-[20px] pr-[20px] lg:pt-[86px] lg:pl-[80px] lg:pr-[60px] md:pt-[60px] md:pl-[60px] md:pr-[40px]`}
    >
      {/* <h1>{role}</h1> */}
      <div className={`${styles.notificationsList} flex flex-col gap-[20px]`}>
        <Notification />
        <Notification />
      </div>
    </section>
  );
}
