"use client";

import React, { useEffect, useState } from "react";
import styles from "./Calendar.module.css";
import { Crew } from "@/types/crew";
import { getCrews } from "@/api/crews";
import { getProjectReport } from "@/api/projects";
import { ProjectStatus } from "@/types/project";


const daysOfWeek = [
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П’ятниця",
  "Субота",
  "Неділя",
];

const dates = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31],
];

const colors: Record<ProjectStatus, string> = {
  [ProjectStatus.COMPLETED]: "#15ae08",
  [ProjectStatus.IN_PROGRESS]: "#0097c0",
  [ProjectStatus.NEW]: "#ffb32680",
  [ProjectStatus.CANCELED]: "#b70000",
};

const Calendar = () => {
  const [calendar, setCalendar] = useState<Crew[]>([]);
  const [token, setToken] = useState<string>("");
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [dayColors, setDayColors] = useState<Record<number, string>>({});

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchCalendarData = async () => {
      try {
        const calendarData = await getCrews(token);
        setCalendar(calendarData);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchCalendarData();
  }, [token]);

  const handleCrewSelect = async (idx: number) => {
    const crew = calendar[idx];
    const updated = calendar.map((c, i) => ({ ...c, selected: i === idx }));
    setCalendar(updated);
    setSelectedCrew(crew);

    if (!crew || !crew.projects?.length || !token) {
      setDayColors({});
      return;
    }

    const colorsMap: Record<number, string> = {};

    for (const proj of crew.projects) {
      try {
        const report = await getProjectReport(proj.id, token);
        const start = new Date(report.project.start_date).getDate();
        const end = new Date(report.project.end_date).getDate();
        const status = report.project.status as ProjectStatus;
        const color = colors[status];

        for (let d = start; d <= end; d++) {
          colorsMap[d] = color;
        }
      } catch (error) {
        console.error(`Error fetching report for project ${proj.id}:`, error);
      }
    }

    setDayColors(colorsMap);
  };

  const getDateColor = (date: number) => {
    return dayColors[date] || "bg-white text-black";
  };

  return (
    <div className="bg-white w-full max-w-[1126px] rounded p-4 sm:p-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] font-inter mx-auto mb-10 mt-10">
      
      <div className={styles.calendarDiv}>
        {calendar.map((crew, idx) => (
          <button
            key={idx}
            onClick={() => handleCrewSelect(idx)}
            className={`${styles.calendarButton} flex-1 px-4 py-2 rounded text-black text-[12px] 
              ${crew.selected 
                ? "font-semibold bg-[linear-gradient(90deg,rgba(255,179,38,0.5)_36.06%,rgba(191,117,42,0.5)_100%)]" 
                : "bg-[linear-gradient(90deg,rgba(255,179,38,0.5)_36.06%,rgba(191,117,42,0.5)_100%)] hover:border hover:border-[#FFB326]"
              } hover:cursor-pointer`}
          >
            {crew.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[12px] sm:text-[14px] mt-4">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="font-medium pb-1 border-b text-black text-[12px] sm:text-[14px] md:text-[18px]"
          >
            <span className="inline xl:hidden">{day.slice(0, 1)}</span>
            <span className="hidden xl:inline">{day}</span>
          </div>
        ))}

        {dates.flat().map((date, i) => {
          const bgColor = dayColors[date] ? dayColors[date] : "white";
          const textColor = dayColors[date] ? "text-white" : "text-black";

          return (
            <button
              key={i}
              className={`rounded-md shadow-md py-1 sm:py-2 mt-2 ${textColor}`}
              style={{ backgroundColor: bgColor }}
            >
              {date}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
