"use client";
import React from "react";
import { Project } from "@/types/project";
import { Client } from "@/types/client";
import styles from "./ProjectInfo.module.css";
import {
  Person,
  Phone,
  Home,
  Mail,
  ArrowLeft,
} from "../../../../../public/icons";
interface Props {
  client: Client;
  project: Project;
}
const statusMap: Record<Project["status"], string> = {
  Done: "Виконано",
  "In progress": "В процесі",
  Waiting: "Очікує",
  Canceled: "Відхилено",
};

const statusColorMap: Record<Project["status"], string> = {
  Done: styles.statusDone,
  "In progress": styles.statusInProgress,
  Waiting: styles.statusWaiting,
  Canceled: styles.statusCanceled,
};

export function ProjectInfo({ client, project }: Props) {
  const translatedStatus = statusMap[project.status] || project.status;
  const statusColorClass = statusColorMap[project.status] || "";
  return (
    <div
      className={`${styles.infoContainer} flex flex-col justify-center items-center`}
    >
      <div className={`${styles.projectInfo} flex flex-col mb-[26px] `}>
        <div className={`${styles.projectInfoName}`}>
          <h2
            className={`${styles.projectInfoNameTytle} flex gap-[20px] mb-[14px]`}
          >
            <span>{project.name}</span> <span>№ 123</span>
          </h2>
        </div>
        <div
          className={`${styles.projectInfoStatus} flex h-[44px] min-w-[288px]  `}
        >
          <div
            className={`${styles.projectInfoStatusContainer} flex justify-start items-center w-full pt-[10px] pb-[10px] pl-[10px]`}
          >
            <div
              className={`${styles.projectInfoStatusIcon} ${statusColorClass} rounded-full w-[24px] h-[24px] mr-[6px]`}
            ></div>
            <div className={`${styles.projectInfoStatusText}`}>
              {translatedStatus}
            </div>
          </div>
          <button
            className={`${styles.projectInfoStatusChageBtn} flex justify-end w-full  items-center pt-[14px] pb-[14px] pr-[28px] `}
          >
            Змінити статус
          </button>
        </div>
        <div
          className={`${styles.projectInfoBackBtn} absolute top-[13px] left-[18px] flex items-center gap-[5px]`}
        >
          <img
            className={`${styles.infoItemImgBack} `}
            src={ArrowLeft.src}
            alt="Назад"
          />
          <span>Назад</span>
        </div>
      </div>
      <div
        className={`${styles.clientInfo} flex flex-col items-center gap-[24px] mb-[40px]`}
      >
        <div className={`${styles.clientInfoItem}`}>
          <img
            className={`${styles.infoItemImg} `}
            src={Person.src}
            alt="Person"
          />
          <span>{client.contactName}</span>
        </div>
        <div className={`${styles.clientInfoItem}`}>
          <img
            className={`${styles.infoItemImg} `}
            src={Phone.src}
            alt="Phone"
          />
          <span>{client.phone}</span>
        </div>
        <div className={`${styles.clientInfoItem}`}>
          <img
            className={`${styles.infoItemImg} `}
            src={Home.src}
            alt="Home "
          />
          <span>{client.address}</span>
        </div>
        <div className={`${styles.clientInfoItem}`}>
          <img
            className={`${styles.infoItemImg} `}
            src={Mail.src}
            alt="Mail "
          />
          <span>{client.mail}</span>
        </div>
      </div>
      <div className={`${styles.projectTotal} w-full rounded-[5px]`}>
        <button
          className={`${styles.projectTotalBtn} w-full h-[106px] cursor-pointer rounded-[5px]`}
        >
          <div className={`${styles.projectTotalBtnText} flex flex-col`}>
            <span className={`${styles.totalBtnTextTytle}`}>
              Орієнтована варість
            </span>
            <span className={`${styles.totalBtnTextSum}`}>72 521,5</span>
          </div>
        </button>
      </div>
    </div>
  );
}
