import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import { useUser } from "@/context/UserContextProvider";
import {  getProjectPaymentsOverdue, Payment } from "@/api/payments";
import { getProjectById } from "@/api/projects";
import { ProjectDetailedResponse } from "@/types/project";

interface NotificationComponentProps {
  id: number;
}

interface Notification {
  notes: NotificationComponentProps[];
}

interface PaymentWithProject {
  payment: Payment;
  project: ProjectDetailedResponse;
}

export const Notification = ({ notes }: Notification) => {
  const { token } = useUser();
  const [note, setNote] = useState<PaymentWithProject[]>([]);

  const formatDate = (date: string | Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  useEffect(() => {
      if (!token) return;
  
      const fetchData = async () => {
        try {
          const results: PaymentWithProject[] = [];
  
          for (const note of notes) {
            const paymentResponse: any = await getProjectPaymentsOverdue(note.id, token);
            const paymentsArray: Payment[] = paymentResponse.data ? paymentResponse.data : [paymentResponse];
            const projectResponse = await getProjectById(note.id, token);
  
            paymentsArray.forEach((payment) => {
              results.push({ payment, project: projectResponse });
            });
          }
  
          setNote(results);
        } catch (error) {
          console.log("Error fetching navigation messages:", error);
        }
      };
  
      fetchData();
    }, [notes, token]);

  return (
    <div
      className={`${styles.notification} pt-[20px] pr-[30px] pb-[20px] pl-[14px] md:pt-[20px] md:pr-[40px] md:pb-[26px] md:pl-[30px] rounded-[5px] flex flex-col gap-[15px]`}
    >
      {note.map((payment, index) => {
        const noteDate = payment.payment.due_date ?? formatDate(payment.payment.updated_at);

        return (
          <div key={index}>
            <div
              className={`${styles.notificationText} flex justify-between gap-[16px]`}
            >
              <div className={`${styles.notificationsTextTytle}`}>
                <h3>{payment.project.name}</h3>
              </div>
              <div className={`${styles.notificationDate}`}>
                <h6>{noteDate}</h6>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <div className={`${styles.notificationsTextContent}`}>
              <h6>{payment.payment.description}</h6>
            </div>
            <div className={`${styles.notificationDate}`}>
                <h6>{payment.payment.amount}</h6>
            </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
