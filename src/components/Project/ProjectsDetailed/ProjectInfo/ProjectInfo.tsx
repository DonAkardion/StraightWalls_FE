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

export function ProjectInfo({ client, project }: Props) {
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
        <div className={`${styles.projectInfoStatus}`}>{project.status}</div>
        <div className={`${styles.projectInfoBackBtn}`}>
          <img
            className={`${styles.infoItemImg} `}
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
