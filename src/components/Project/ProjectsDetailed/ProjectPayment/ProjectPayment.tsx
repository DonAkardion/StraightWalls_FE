"use client";
import React from "react";
import styles from "./ProjectPayment.module.css";
import { StageCard } from "./stageCard/stageCard";

export function ProjectPayment() {
  return (
    <section className={`${styles.Payment} mb-[40px]`}>
      <div
        className={`${styles.generalStats} flex flex-col md:md:flex-col-reverse gap-[40px] md:gap-[60px] mb-[16px] md:mb-[32px]`}
      >
        <div
          className={`${styles.generalStatsTotal} flex flex-col md:flex-row gap-[24px] md:`}
        >
          <div className={`${styles.totalItem} `}>
            <span className={`${styles.totalItemText} `}>Загальна сума</span>
            <span className={`${styles.totalItemSum} `}>72 521,5</span>
          </div>
          <div className={`${styles.totalItem}`}>
            <span className={`${styles.totalItemText} `}>Оплачені кошти</span>
            <span className={`${styles.totalItemSum} `}>12 000</span>
          </div>
          <div className={`${styles.totalItem}`}>
            <span className={`${styles.totalItemText} `}>
              Залишок до оплати
            </span>
            <span className={`${styles.totalItemSum} `}>60 521,5</span>
          </div>
        </div>
        <div className={`${styles.generalStatsDatailed} `}>
          <h2 className={`${styles.datailedTytle} mb-[16px]`}>Оплата:</h2>

          <div className={`${styles.datailedList} flex flex-col gap-[16px]`}>
            <div className={`${styles.datailedListItem}`}>
              <span className={`${styles.datailedListItemText}`}>
                Вартість усіх виконаних робіт
              </span>
              <span className={`${styles.datailedListItemSum}`}>
                72 521,5 грн
              </span>
            </div>
            <div className={`${styles.datailedListItem}`}>
              <span className={`${styles.datailedListItemText}`}>
                Вартість усіх використанних матеріалів
              </span>
              <span className={`${styles.datailedListItemSum}`}>
                31 454 грн
              </span>
            </div>
            <div className={`${styles.datailedListItem}`}>
              <span className={`${styles.datailedListItemText}`}>
                Аванс при заїзді бригади{" "}
              </span>
              <span className={`${styles.datailedListItemSum}`}>2 000 грн</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.stages} grid md:grid-cols-2 gap-[24px]`}>
        <StageCard
          title="1-етап"
          sum="12 000 грн"
          description="Для того щоб розпочати нам потрібен аванс на матеріали та ключ від Об’єкту. Ви також можете залишити за декілька днів до початку роботи, коли Вам зручно, в офісі за адресою: вул. Олександра Олеся, 9 «Студія ремонту». Або якщо це пізніше то для того, щоб стати в чергу, потрібен аванс 2000 грн."
          status="Виконано"
        />
        <StageCard
          title="2-етап"
          sum="50 000 грн"
          description={`Остаточний розрахунок здійснюється після приймання робіт Замовником за фактично виконаний обсяг робіт (ми попередимо за день). Якщо у Вас з якихось причин не виходить це зробити, то розрахунок проводиться в офісі "Студія Ремонту" (вул. Олександра Олеся, 9) `}
          status="Не виконано"
        />
      </div>
    </section>
  );
}
