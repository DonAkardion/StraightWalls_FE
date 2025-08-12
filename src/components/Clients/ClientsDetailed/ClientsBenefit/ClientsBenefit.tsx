import React from "react";
import styles from "./ClientsBenefit.module.css";

export const ClientsBenefit = () => {
  return (
    <section className="text-center mt-15">
      <div className="max-w-[1030px] mx-auto px-4">
        <div className={`${styles.clientsProfit} mt-5 rounded py-3`}>
          <p className="text-[20px] text-black">Дохід від клієнта</p>
          <h1 className={`${styles.clientsPrice}`}>72 521,5</h1>
        </div>
        <div className={`${styles.clientsProfit} mt-5 rounded`}>
          <div className="flex justify-between items-center px-5 py-3">
            <p className="text-[20px] text-black">
              Вартість усіх виконаних робіт
            </p>
            <h2 className={`${styles.clientsPrice}`}>41 057,5 грн</h2>
          </div>
        </div>
        <div className={`${styles.clientsProfit} mt-5 rounded`}>
          <div className="flex justify-between items-center px-5 py-3">
            <p className="text-[20px] text-black">
              Вартість усіх використанних матеріалів
            </p>
            <h2 className={`${styles.clientsPrice}`}>31 454 грн</h2>
          </div>
        </div>
      </div>
    </section>
  );
};
