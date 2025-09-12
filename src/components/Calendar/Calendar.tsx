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

const colors: Partial<Record<ProjectStatus, string>> = {
  [ProjectStatus.COMPLETED]: "#15ae08",
  [ProjectStatus.IN_PROGRESS]: "#0097c0",
  [ProjectStatus.NEW]: "#ffb326",
  [ProjectStatus.CANCELED]: "#b70000",
  [ProjectStatus.CONFIRMED]: "#1b6a14",
  [ProjectStatus.SCHEDULED]: "#0f5669",
};

const Calendar = () => {
  const [calendar, setCalendar] = useState<Crew[]>([]);
  const [token, setToken] = useState<string>("");
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [dayColors, setDayColors] = useState<Record<number, string[]>>({});

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const generateDates = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: number[][] = [];
    let week: number[] = [];
    const offset = (firstDay + 6) % 7;

    for (let i = 0; i < offset; i++) week.push(0);

    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length) {
      while (week.length < 7) week.push(0);
      weeks.push(week);
    }

    return weeks;
  };

  const dates = generateDates(currentMonth, currentYear);

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
    setCalendar(calendar.map((c, i) => ({ ...c, selected: i === idx })));
    setSelectedCrew(crew);

    if (!crew || !crew.projects?.length || !token) {
      setDayColors({});
      return;
    }

        const reports = await Promise.all(
      crew.projects.map((proj) => getProjectReport(proj.id, token).catch(() => null))
    );

    const colorsMap: Record<number, string[]> = {};
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    reports.forEach((report) => {
      if (!report) return;
      const color = colors[report.project.status as ProjectStatus];
      if (!color) return;

      const start = report.project.start_date
        ? new Date(report.project.start_date)
        : new Date(report.project.created_at);
      const end = report.project.end_date
        ? new Date(report.project.end_date)
        : new Date(report.project.updated_at);

      for (let d = 1; d <= daysInCurrentMonth; d++) {
        const dayDate = new Date(currentYear, currentMonth, d);
        if (dayDate >= start && dayDate <= end) {
          if (!colorsMap[d]) colorsMap[d] = [];
          if (!colorsMap[d].includes(color)) colorsMap[d].push(color);
        }
      }
    });

    setDayColors(colorsMap);
  };

  useEffect(() => {
    setDayColors({})
    if (selectedCrew) {
      const idx = calendar.findIndex((c) => c.id === selectedCrew.id);
      if (idx !== -1) handleCrewSelect(idx);
    }
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="bg-white w-full max-w-[1126px] rounded p-4 sm:p-6 drop-shadow-md font-inter mx-auto mb-10 mt-10">
      <div className="flex justify-center items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            className="text-[23px] font-bold hover:cursor-pointer hover:text-red-500"
            onClick={handlePrevMonth}
          >
            &laquo;
          </button>
          <span className="p-2">
            {new Date(currentYear, currentMonth).toLocaleString("uk-UA", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            className="text-[23px] font-bold hover:cursor-pointer hover:text-green-500"
            onClick={handleNextMonth}
          >
            &raquo;
          </button>
        </div>
      </div>

      {calendar.length > 0 && (
        <div className={styles.calendarDiv}>
          {calendar.map((crew, idx) => (
            <button
              key={idx}
              onClick={() => handleCrewSelect(idx)}
              className={`${styles.calendarButton} flex-1 px-4 py-2 rounded text-black text-[12px] 
                ${
                  crew.selected
                    ? "font-semibold bg-[linear-gradient(90deg,rgba(255,179,38,0.5)_36.06%,rgba(191,117,42,0.5)_100%)]"
                    : "bg-[linear-gradient(90deg,rgba(255,179,38,0.5)_36.06%,rgba(191,117,42,0.5)_100%)] hover:outline hover:outline-[#FFB326]"
                }`}
            >
              {crew.name}
            </button>
          ))}
        </div>
      )}

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
          if (date === 0) return <div key={i} />;

          const dayColorsArray = dayColors[date] || [];
          let bgStyle: React.CSSProperties = { backgroundColor: "white" };

          if (dayColorsArray.length === 1) {
            bgStyle.backgroundColor = dayColorsArray[0];
            bgStyle.color = "white";
          } else if (dayColorsArray.length > 1) {
            bgStyle.background = `conic-gradient(${dayColorsArray.join(", ")})`;
            bgStyle.color = "white";
          }

          return (
            <button
              key={i}
              className="rounded-md shadow-md py-1 sm:py-2 mt-2"
              style={bgStyle}
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
