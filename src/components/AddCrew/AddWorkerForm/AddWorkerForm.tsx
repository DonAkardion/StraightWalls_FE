"use client";

import React, { useState } from "react";
import styles from "./AddWorker.module.css";
import { Worker } from "@/types/worker";
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders";

interface AddWorkerFormProps {
  crewWorkers: Worker[];
  setCrewWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
}

export default function AddWorkerForm({
  crewWorkers,
  setCrewWorkers,
}: AddWorkerFormProps) {
  const [inputs, setInputs] = useState<Worker>({
    id: 0,
    full_name: "",
    position: "",
    phone_number: "",
    team_id: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddWorker = () => {
    if (
      !inputs.full_name.trim() ||
      !inputs.position.trim() ||
      !inputs.phone_number.trim()
    ) {
      return alert("Заповніть всі поля робітника");
    }

    setCrewWorkers((prev) => [...prev, { ...inputs, id: Date.now() }]);
    setInputs({
      id: 0,
      full_name: "",
      position: "",
      phone_number: "",
      team_id: null,
    });
  };

  const headerElements = [
    <div
      key="full_name"
      className="flex items-center gap-2 text-[18px] text-black"
    >
      <span className="w-7"></span>
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap md:whitespace-normal md:overflow-visible md:text-clip">
        ПІБ виконавця
      </span>
    </div>,
    <div
      key="position"
      className="flex justify-center items-center text-[18px] text-black"
    >
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap md:whitespace-normal md:overflow-visible md:text-clip">
        Посада
      </span>
    </div>,
    <div
      key="phone_number"
      className="flex justify-center items-center text-[18px] text-black"
    >
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap md:whitespace-normal md:overflow-visible md:text-clip">
        Контакти
      </span>
    </div>,
  ];

  return (
    <section className="mt-8">
      <p className="text-[20px] text-black mb-3">Робітники</p>
      <div
        className={`${styles.addWorkerForm} bg-white rounded-lg overflow-hidden`}
      >
        <div className={`${styles.addTopRow} grid grid-cols-3 px-8 py-5`}>
          <ProjectsHeaders
            headers={headerElements as any}
            className="text-[14px] tracking-tight"
          />
        </div>

        {crewWorkers.map((w, i) => (
          <React.Fragment key={i}>
            <div
              className={`${styles.borderBottom} grid grid-cols-3 px-6 py-3 transition`}
            >
              <div className="flex items-center gap-2 text-black">
                <span>{i + 1}</span>
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap md:whitespace-normal md:overflow-visible md:text-clip">
                  {w.full_name}
                </span>
              </div>
              <div className="flex justify-center items-center text-black">
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap md:whitespace-normal md:overflow-visible md:text-clip">
                  {w.position}
                </span>
              </div>
              <div className="flex justify-center items-center text-black">
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap md:whitespace-normal md:overflow-visible md:text-clip">
                  {w.phone_number}
                </span>
              </div>
            </div>
            <div className="border-b-2 mx-auto w-[95%]"></div>
          </React.Fragment>
        ))}

        <div className="grid grid-cols-3 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#0097c0]">{crewWorkers.length + 1}</span>
            <input
              type="text"
              placeholder="Введіть ПІБ"
              name="full_name"
              value={inputs.full_name}
              onChange={handleChange}
              className={`${styles.addWorkerInput} outline-none text-[15px] py-2 w-full rounded-md px-2`}
            />
          </div>
          <div className="flex justify-center items-center">
            <input
              type="text"
              name="position"
              placeholder="Ввести"
              value={inputs.position}
              onChange={handleChange}
              className={`${styles.addWorkerInput} outline-none text-[15px] py-2 w-full text-center rounded-md px-2`}
            />
          </div>
          <div className="flex justify-center items-center">
            <input
              type="text"
              name="phone_number"
              placeholder="Ввести"
              value={inputs.phone_number}
              onChange={handleChange}
              className={`${styles.addWorkerInput} outline-none text-[15px] w-full py-2 text-center rounded-md px-2`}
            />
          </div>
        </div>

        <div className="border-b-2 mx-auto w-[95%]"></div>

        <div className="p-6">
          <button
            type="button"
            onClick={handleAddWorker}
            className={`${styles.addWorkerButton} cursor-pointer w-full h-12 md:h-[50px] rounded-md text-[16px] text-black transition`}
          >
            Додати робітника
          </button>
        </div>
      </div>
    </section>
  );
}
