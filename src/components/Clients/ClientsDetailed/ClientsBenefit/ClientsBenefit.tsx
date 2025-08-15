import React from "react";
import styles from "./ClientsBenefit.module.css";

export const ClientsBenefit = () => {
  return (
    <section className="w-full text-center mt-15">
        <div className={`${styles.clientsProfit} mt-5 rounded py-10`}>
          <p className={styles.clientsLabel}>Дохід від клієнта</p>
          <h1 className={styles.clientsPrice}>72 521,5</h1>
        </div>

        <div className={`${styles.clientsProfit} mt-5 rounded`}>
          <div className="flex justify-between items-center">
            <p className={styles.clientsLabel}>
              Вартість усіх виконаних робіт
            </p>
            <h2 className={styles.clientsPrice}>41 057,5 грн</h2>
          </div>
        </div>

        <div className={`${styles.clientsProfit} mt-5 rounded`}>
          <div className="flex justify-between items-center">
            <p className={styles.clientsLabel}>
              Вартість усіх використанних матеріалів
            </p>
            <h2 className={styles.clientsPrice}>31 454 грн</h2>
          </div>
        </div>
    </section>
  );
};
