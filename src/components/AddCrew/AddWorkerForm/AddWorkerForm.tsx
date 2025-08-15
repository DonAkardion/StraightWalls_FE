"use client";

import React from "react";
import styles from "./AddWorker.module.css";
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders";

export default function AddWorkerForm() {
  const workers = [
    {
      name: "Галушко Іван Степанович",
      position: "Водій",
      salary: "12 000 грн",
      contacts: "+380 95 61 56 123",
    },
  ];

  const headerElements = [
    <div key="name" className="flex items-center gap-2 text-[18px] text-black">
      <span className="w-7"></span>
      ПІБ виконавця
    </div>,
    <div key="position" className="flex justify-center items-center text-[18px] text-black">
      Посада
    </div>,
    <div key="salary" className="flex justify-center items-center text-[18px] text-black">
      Зарплата
    </div>,
    <div key="contacts" className="flex justify-center items-center text-[18px] text-black">
      Контакти
    </div>,
  ];

  return (
    <section className="mt-8">
      <p className="text-[20px] text-black mb-3">Робітники</p>
      <div className={`${styles.addWorkerForm} bg-white rounded-lg overflow-hidden`}>
        <div className={`${styles.addTopRow} grid grid-cols-4 px-8 py-5`}>
          <ProjectsHeaders
            headers={headerElements as any} 
            className="text-[14px] tracking-tight"
          />
        </div>
        {workers.map((w, i) => (
          <React.Fragment key={i}>
            <div className={`${styles.borderBottom} grid grid-cols-4 px-6 py-3 transition`}>
              <div className="flex items-center gap-2 text-black">
                <span className="text-black">{i + 1}</span>
                <span>{w.name}</span>
              </div>
              <div className="flex justify-center items-center text-black">{w.position}</div>
              <div className="flex justify-center items-center text-black">{w.salary}</div>
              <div className="flex justify-center items-center text-black">{w.contacts}</div>
             </div>
            <div className="border-b-2 mx-auto w-[95%]"></div>
          </React.Fragment>
))}

        <div className="grid grid-cols-4 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#0097c0]">{workers.length + 1}</span>
            <input
              type="text"
              placeholder="Введіть ПІБ"
              className={`${styles.addWorkerInput} outline-none text-[15px] py-2 w-full rounded-md px-2`}
            />
          </div>
          <div className="flex justify-center items-center">
            <input
              type="text"
              placeholder="Ввести"
              className={`${styles.addWorkerInput} outline-none text-[15px] py-2 text-center rounded-md px-2`}
            />
          </div>
          <div className="flex justify-center items-center">
            <input
              type="text"
              placeholder="Ввести"
              className={`${styles.addWorkerInput} outline-none text-[15px] py-2 text-center rounded-md px-2`}
            />
          </div>
          <div className="flex justify-center items-center">
            <input
              type="text"
              placeholder="Ввести"
              className={`${styles.addWorkerInput} outline-none text-[15px] py-2 text-center rounded-md px-2`}
            />
          </div>
        </div>
        <div className="border-b-2 mx-auto w-[95%]"></div>
        <div className="p-6">
          <button
            type="button"
            className={`${styles.addWorkerButton} cursor-pointer w-full h-12 md:h-[50px] rounded-md text-[16px] text-black transition`}
          >
            Додати робітника
          </button>
        </div>
      </div>
    </section>
  );
}
