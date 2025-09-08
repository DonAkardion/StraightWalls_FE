"use client";
import React, { useEffect, useState } from "react";
import styles from "./Notifications.module.css";
import { Notification } from "@/components/Notifications/components/Notification";
import { useUser } from "@/context/UserContextProvider";
import { getProjects } from "@/api/projects";

export function Notifications() {
  const { token } = useUser();
  const [notification, setNotification] = useState<{ id: number }[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchProjectNotifications = async () => {
      try {
        const projectNote = await getProjects(token);
        setNotification(projectNote.map((p) => ({ id: p.id })));
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    fetchProjectNotifications();
  }, [token])

  return (
    <section
      className={`${styles.notifications} max-w-[1126px] m-auto pt-[50px] pl-[20px] pr-[20px] lg:pt-[86px] lg:pl-[80px] lg:pr-[60px] md:pt-[60px] md:pl-[60px] md:pr-[40px]`}
    >
      {/* <h1>{role}</h1> */}
      <div className={`${styles.notificationsList} flex flex-col gap-[20px]`}>
        <Notification notes={notification}/>
      </div>
    </section>
  );
}
