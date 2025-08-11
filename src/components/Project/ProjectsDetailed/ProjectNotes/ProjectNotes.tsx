"use client";
import React from "react";
import styles from "./ProjectNotes.module.css";

export function ProjectNotes() {
  return (
    <section className={`${styles.notes} mb-[40px]`}>
      <h2 className={`${styles.notesTytle} mb-[16px]`}>Примітки</h2>
      <h3 className={`${styles.notesText} mb-[30px]`}>
        Також звертаємо Вашу увагу, що Замовник забезпечує:
      </h3>
      <ul className={`${styles.notesList} flex flex-col gap-[25px]`}>
        <li className={`${styles.notesListItem} `}>
          <div className={`${styles.notesListItemNumber}`}>1</div>
          <div className={`${styles.notesListItemText} `}>
            Повний доступ до Об&apos;єкта (Дозвіл на проведення штукатурних
            робіт (в різних ЖК свої умови, уточніть на охороні))
          </div>
        </li>
        <li className={`${styles.notesListItem} `}>
          <div className={`${styles.notesListItemNumber}`}>2</div>
          <div className={`${styles.notesListItemText} `}>
            Повний доступ до стін та нявність санвузла
          </div>
        </li>
        <li className={`${styles.notesListItem} `}>
          <div className={`${styles.notesListItemNumber}`}>3</div>
          <div className={`${styles.notesListItemText} `}>
            Водопровід, каналізацію для квартир
          </div>
        </li>
        <li className={`${styles.notesListItem} `}>
          <div className={`${styles.notesListItemNumber}`}>4</div>
          <div className={`${styles.notesListItemText} `}>
            Електроенергію 220/380В
          </div>
        </li>
      </ul>
    </section>
  );
}
