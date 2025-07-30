import React from "react";
import styles from "./Notification.module.css";

export const Notification = () => {
  return (
    <div className={`${styles.notification} `}>
      <div className={`${styles.notificationText} `}>
        <div className={`${styles.notificationsTextTytle} `}>
          Водій взяв замовлення №123
        </div>
        <div className={`${styles.notificationsTextContent} `}>
          Водій Петро ІВаногвич взяв замволення №123
        </div>
      </div>
      <div className={`${styles.notificationDate} `}>14.07.2025</div>
    </div>
  );
};
