"use client";
import React from "react";
import styles from "./CrewWorkersList.module.css";
import { Worker } from "@/types/worker";
import { Trash } from "../../../../../public/icons";

interface Props {
  workers: Worker[];
  onAdd: () => void;
  onDelete: (id: number) => void;
}

export function CrewWorkersList({ workers, onAdd, onDelete }: Props) {
  return (
    <div className={`${styles.createObjectContainer} border-0 rounded-[5px]`}>
      <div
        className={`${styles.createObjectHead} flex justify-between p-3 items-center `}
      >
        <h6 className="">Робітники</h6>
        <button
          onClick={onAdd}
          className={`${styles.createObjectBtn} px-5 py-2 rounded cursor-pointer`}
        >
          Створити робітника
        </button>
      </div>

      {workers.length === 0 ? (
        <p className="text-gray-500 p-3 pl-5 pb-5 mt-3">Робітників ще немає</p>
      ) : (
        <ul className="space-y-2 max-h-[290px] overflow-y-scroll">
          {workers.map((w) => (
            <li
              key={w.id}
              className="flex justify-between items-center my-1 p-3 pl-5 rounded"
            >
              <div>
                <div className="font-medium">{w.full_name}</div>
                <div className="text-sm text-gray-600">{w.position}</div>
              </div>
              <button onClick={() => onDelete(w.id)}>
                <img
                  src={Trash.src}
                  alt="Delete"
                  className="w-[21px] h-[21px] cursor-pointer mr-3"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
