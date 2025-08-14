import React from "react";
import styles from "./DriversBalance.module.css";

interface DriversBalanceItem {
  label: string;
  value: string | number;
}

interface DriversBalanceProps {
  items: DriversBalanceItem[];
}

export const DriversBalance: React.FC<DriversBalanceProps> = ({ items }) => {
  return (
    <section className={`${styles.driversBalance} md-[40px] md:mb-[60px] `}>
      <div className={`${styles.tytle} mb-[15px] `}>Сума у водіїв</div>
      <ul
        className={`${styles.totalDriversbalanceList} flex flex-col w-full gap-[15px]`}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`${styles.totalDriversbalanceListItem} flex items-center justify-between py-[15px] px-[22px] md:p-[24px]  rounded-[5px] `}
          >
            <div className={styles.ListItemName}>{item.label}</div>
            <div className={styles.ListItemValue}>
              {item.value} <span>грн</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
