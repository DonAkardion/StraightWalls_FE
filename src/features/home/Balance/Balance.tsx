import React from "react";
import styles from "./Balance.module.css";

export const Balance = () => {
  return (
    <section
      className={`${styles.balance} lg:pt-[65px] lg:pr-[63px] lg:pl-[80px] `}
    >
      <div className={`${styles.tytle} mb-[15px]`}>Баланс</div>
      <ul className={`${styles.totalbalanceList} flex w-full gap-[24px]`}>
        <li className={`${styles.totalbalanceListItem}`}>
          <div className={`${styles.ListItemName}`}>Гроші в касі</div>
          <div className={`${styles.ListItemValue}`}>345</div>
        </li>
        <li className={`${styles.totalbalanceListItem}`}>
          <div className={`${styles.ListItemName}`}>Борг</div>
          <div className={`${styles.ListItemValue}`}>12000</div>
        </li>
        <li className={`${styles.totalbalanceListItem}`}>
          <div className={`${styles.ListItemName}`}>Заробіток на роботі</div>
          <div className={`${styles.ListItemValue}`}>30000</div>
        </li>
        <li className={`${styles.totalbalanceListItem}`}>
          <div className={`${styles.ListItemName}`}>
            Заробіток на матеріалах
          </div>
          <div className={`${styles.ListItemValue}`}>10000</div>
        </li>
      </ul>
    </section>
  );
};
