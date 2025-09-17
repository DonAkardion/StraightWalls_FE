"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContextProvider";
import { ProjectReportResponse } from "@/types/project";
import { changeProjectStatus } from "@/api/projects";
import styles from "./ProjectInfo.module.css";
import { Person, Phone, Home, ArrowLeft, Calendar } from "../../../../../public/icons";

interface Props {
  report: ProjectReportResponse;
}

const statusMap: Record<string, string> = {
  completed: "Виконано",
  in_progress: "В Роботі",
  new: "В Черзі",
  canceled: "Скасовано",
};

const statusColorMap: Record<string, string> = {
  completed: styles.statusDone,
  in_progress: styles.statusInProgress,
  new: styles.statusWaiting,
  canceled: styles.statusCanceled,
};

export function ProjectInfo({ report }: Props) {
  const router = useRouter();
  const { token } = useUser();
  const { project } = report;
  const client = project.client;
  const object = project.object;

  const [showDropdown, setShowDropdown] = useState(false);
  const [mockStatus, setMockStatus] = useState(project.status);

  const containerRef = useRef<HTMLDivElement>(null);

  const translatedStatus = statusMap[mockStatus] || mockStatus;
  const statusColorClass = statusColorMap[mockStatus] || "";

  const handleStatusChange = async (newStatus: string) => {
    setShowDropdown(false);
    if (!token) return;

    try {
      // Робимо PATCH запит на бекенд
      await changeProjectStatus(project.id, token, { status: newStatus });
      // Оновлюємо локальний стан
      setMockStatus(newStatus as typeof mockStatus);
    } catch (error) {
      console.error("Не вдалося змінити статус проекту:", error);
    }
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
            <span>{project.name}</span> <span>№ {project.id}</span>
          </h2>
        </div>
        <div
          className={`${styles.projectInfoStatus} relative flex h-[44px] min-w-[288px] md:min-w-[300px] `}
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
              className={`${styles.statusChangeContainer} absolute top-[-4px] left-0 mt-1 w-[136px] md:w-[140px] rounded-[5px] z-10`}
            >
              {Object.entries(statusMap).map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  className={`${styles.statusChangeItem} px-2 py-2 flex rounded-[5px] hover:bg-gray-100 cursor-pointer`}
                >
                  <div
                    className={`${styles.editStatusIcon} ${statusColorMap[key]} rounded-full w-[24px] h-[24px] mr-[6px]`}
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
          <span>{client.full_name}</span>
        </div>
        <div className={`${styles.clientInfoItem}`}>
          <img
            className={`${styles.infoItemImg} `}
            src={Phone.src}
            alt="Phone"
          />
          <span>{client.phone_number}</span>
        </div>
        <div className={`${styles.clientInfoItem}`}>
          <img
            className={`${styles.infoItemImg} `}
            src={Home.src}
            alt="Home "
          />
          <span>{object.name}</span>
          <span>{object.address}</span>
        </div>
        <div className={`${styles.clientInfoItem}`}>
          <img
            className={`${styles.infoItemImg} `}
            src={Calendar.src}
            alt="Calendar "
          />
          <span>{project.start_date} /</span>
          <span>{project.end_date}</span>
        </div>
        {/* <div className={`${styles.clientInfoItem}`}>
          <img
            className={`${styles.infoItemImg} `}
            src={Mail.src}
            alt="Mail "
          />
          <span>{client.phone_number}</span>
        </div> */}
      </div>
      <div className={`${styles.projectTotal} w-full rounded-[5px]`}>
        <button
          className={`${styles.projectTotalBtn} w-full h-[106px] md:h-[144px] rounded-[5px]`}
        >
          <div
            className={`${styles.projectTotalBtnText} flex flex-col md:gap-0 gap-[10px]`}
          >
            <span className={`${styles.totalBtnTextTytle}`}>
              Орієнтована варість
            </span>
            <span className={`${styles.totalBtnTextSum}`}>
              {report.totalProjectCost}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
