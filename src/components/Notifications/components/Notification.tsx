import React from "react";
import styles from "./Notification.module.css";

export const Notification = () => {
  return (
    <div
      className={`${styles.notification} pt-[20px] pr-[30px] pb-[20px] pl-[14px] md:pt-[20px] md:pr-[40px] md:pb-[26px] md:pl-[30px] rounded-[5px] flex flex-col gap-[15px] `}
    >
      <div
        className={`${styles.notificationText} flex justify-between gap-[16px]`}
      >
        <div className={`${styles.notificationsTextTytle} `}>
          <h3>Водій взяв замовлення №123</h3>
        </div>
        <div className={`${styles.notificationDate} `}>
          <h6>14.07.2025</h6>
        </div>
      </div>
      <div className={`${styles.notificationsTextContent} `}>
        <h6>Водій Петро Іванович взяв замволення №123</h6>
      </div>
    </div>
  );
};
