"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mockStatus, setMockStatus] = useState<Project["status"]>(
    project.status
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const translatedStatus = statusMap[mockStatus] || mockStatus;
  const statusColorClass = statusColorMap[mockStatus] || "";

  const handleStatusChange = (newStatus: Project["status"]) => {
    setMockStatus(newStatus);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`${styles.infoContainer} flex flex-col justify-center items-center md:items-start mb-[40px] md:mb-[60px]`}
    >
      <div
        className={`${styles.projectInfo} flex flex-col md:flex-row xl:gap-[60px] lg:gap-[20px] md:gap-[20px] items-center md:w-full mb-[26px] `}
      >
        <div className={`${styles.projectInfoName}`}>
          <h2
            className={`${styles.projectInfoNameTytle} text-nowrap flex gap-[20px] mb-[14px] md:mb-0 md:gap-[6px]`}
          >
            <span>{project.name}</span> <span>№ 123</span>
          </h2>
        </div>
        <div
          className={`${styles.projectInfoStatus} relative flex h-[44px] min-w-[288px] md:min-w-[292px] `}
          ref={containerRef}
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
            onClick={() => setShowDropdown((prev) => !prev)}
            className={`${styles.projectInfoStatusChageBtn} flex justify-end w-full cursor-pointer items-center pt-[14px] pb-[14px] pr-[28px] pl-[16px] whitespace-nowrap`}
          >
            Змінити статус
          </button>
          {showDropdown && (
            <div
              className={`${styles.statusChangeContainer} absolute top-[-4px] left-0 mt-1 w-[130px] rounded-[5px] z-10`}
            >
              {Object.entries(statusMap).map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => handleStatusChange(key as Project["status"])}
                  className={`${styles.statusChangeItem} px-2 py-2 flex rounded-[5px] hover:bg-gray-100 cursor-pointer`}
                >
                  <div
                    className={`${styles.editStatusIcon} ${
                      statusColorMap[key as Project["status"]]
                    } rounded-full w-[24px] h-[24px] mr-[6px]`}
                  ></div>
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className={`${styles.projectInfoBackBtn} absolute md:static top-[13px] left-[18px] flex items-center gap-[5px] md:ml-auto `}
        >
          <button
            className="flex items-center gap-[5px] cursor-pointer"
            onClick={() => router.back()}
          >
            <img
              className={`${styles.infoItemImgBack} `}
              src={ArrowLeft.src}
              alt="Назад"
            />
            <span>Назад</span>
          </button>
        </div>
      </div>
      <div
        className={`${styles.clientInfo} flex flex-col md:flex-row items-center gap-[24px] xl:gap-[50px] lg:gap-[10px] mb-[40px] md:mb-[26px] flex-wrap `}
      >
        <div className={`${styles.clientInfoItem} `}>
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
          className={`${styles.projectTotalBtn} w-full h-[106px]  rounded-[5px]`}
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
