"use client";
import React from "react";
import styles from "./ClientObjectsList.module.css";
import { ClientObject } from "@/types/client";
import { Trash } from "../../../../public/icons";

interface Props {
  objects: ClientObject[];
  onAdd: () => void;
  onDelete: (id: number) => void;
}

export function ClientObjectsList({ objects, onAdd, onDelete }: Props) {
  return (
    <div className={`${styles.createObjectContainer} border-0 rounded-[5px]`}>
      <div
        className={`${styles.createObjectHead} flex justify-between p-3 items-center `}
      >
        <h6 className=" ">Об’єкти</h6>
        <button
          onClick={onAdd}
          className={`${styles.createObjectBtn} px-5 py-2 rounded cursor-pointer`}
        >
          Додати об’єкт
        </button>
      </div>

      {objects.length === 0 ? (
        <p className="text-gray-500 p-3 pl-5 pb-5 mt-3">Об’єктів ще немає</p>
      ) : (
        <ul className="max-h-[200px] overflow-y-scroll space-y-2">
          {objects.map((obj) => (
            <li
              key={obj.id}
              className="flex justify-between items-center mt-2 p-3 pl-5 rounded"
            >
              <div>
                <div className="">{obj.name}</div>
                <div className="text-sm text-gray-600">{obj.address}</div>
                {obj.description && (
                  <div className="text-xs text-gray-500">{obj.description}</div>
                )}
              </div>
              <button onClick={() => onDelete(obj.id)} className="">
                <img
                  src={Trash.src}
                  alt="Delete"
                  className={`${styles.TableItemIcon} w-[21px] h-[21px] cursor-pointer mr-3`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
