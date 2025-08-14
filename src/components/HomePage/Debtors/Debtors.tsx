import React from "react";
import styles from "./Debtors.module.css";

interface DebtorsItem {
  label: string;
  value: string | number;
}

interface DebtorsProps {
  items: DebtorsItem[];
}

export const Debtors: React.FC<DebtorsProps> = ({ items }) => {
  return (
    <section className={`${styles.debtors} `}>
      <div className={`${styles.tytle} mb-[15px] `}>Боржники</div>
      <ul className={`${styles.debtorsList} flex flex-col w-full gap-[15px]`}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`${styles.debtorsListItem} flex items-center justify-between py-[15px] px-[22px] md:p-[24px]  rounded-[5px] `}
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
