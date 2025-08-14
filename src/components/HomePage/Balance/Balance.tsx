import React from "react";
import styles from "./Balance.module.css";

interface BalanceItem {
  label: string;
  value: string | number;
}

interface BalanceProps {
  items: BalanceItem[];
}

export const Balance: React.FC<BalanceProps> = ({ items }) => {
  return (
    <section className={`${styles.balance} mb-[40px] md:mb-[60px]`}>
      <div className={`${styles.tytle} mb-[10px] md:mb-[15px]`}>Баланс</div>
      <ul
        className={`${styles.totalbalanceList} flex md:flex-row flex-col w-full gap-[24px]`}
      >
        {items.map((item, index) => (
          <li key={index} className={`${styles.totalbalanceListItem}`}>
            <div className={styles.ListItemName}>{item.label}</div>
            <div className={styles.ListItemValue}>{item.value}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};
