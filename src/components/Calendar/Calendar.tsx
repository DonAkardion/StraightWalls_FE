"use client";

import React, { useEffect, useState } from "react";
import styles from "./Calendar.module.css";
import { Crew } from "@/types/crew";
import { getCrews } from "@/api/crews";
import { getProjectReport } from "@/api/projects";
import { Project } from "@/types/project";
import { useUser } from "@/context/UserContextProvider";

const daysOfWeek = [
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П’ятниця",
  "Субота",
  "Неділя",
];

const colors: Record<string, string> = {
  new: "#0097c0",
  in_progress: "#ffb326",
  completed: "#15ae08",
  canceled: "#b70000",
};

type DayColorsMap = Record<
  number,
  Record<number, Record<number, { color: string; id: number; name: string }[]>>
>;

const Calendar = () => {
  const [calendar, setCalendar] = useState<Crew[]>([]);
  const { token } = useUser();
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [dayColors, setDayColors] = useState<DayColorsMap>({});

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
    if (!token) return;

    const fetchCalendarData = async () => {
      try {
        const calendarData = await getCrews(token);
        setCalendar(calendarData);

        if (calendarData.length > 0) {
          setSelectedCrew(calendarData[0]);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchCalendarData();
  }, [token]);

  const handleCrewSelect = async (crew: Crew) => {
    setCalendar(calendar.map((c) => ({ ...c, selected: c.id === crew.id })));
    setSelectedCrew(crew);

    const validProjects = crew.projects?.filter(
      (proj): proj is Project => !!proj.start_date && !!proj.end_date
    );

    if (!validProjects?.length || !token) {
      setDayColors({});
      return;
    }

    const reports = await Promise.all(
      validProjects.map((proj) =>
        getProjectReport(proj.id, token).catch(() => null)
      )
    );

    const colorsMap: DayColorsMap = {};

    reports.forEach((report) => {
      if (!report) return;

      const { status, start_date, end_date, name, id } = report.project;
      const baseColor = colors[status];
      if (!baseColor) return;

      const start = new Date(start_date);
      const end = new Date(end_date);

      const totalDays = Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      );

      for (let i = 0; i <= totalDays; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        const y = d.getFullYear();
        const m = d.getMonth();
        const day = d.getDate();

        if (!colorsMap[y]) colorsMap[y] = {};
        if (!colorsMap[y][m]) colorsMap[y][m] = {};
        if (!colorsMap[y][m][day]) colorsMap[y][m][day] = [];

        const alpha = 0.5 + (i / totalDays) * 0.5;
        const rgba = baseColor.replace("#", "");
        const r = parseInt(rgba.substring(0, 2), 16);
        const g = parseInt(rgba.substring(2, 4), 16);
        const b = parseInt(rgba.substring(4, 6), 16);
        const colorWithAlpha = `rgba(${r},${g},${b},${alpha.toFixed(2)})`;

        colorsMap[y][m][day].push({ color: colorWithAlpha, id, name });
      }
    });

    setDayColors(colorsMap);
  };

  useEffect(() => {
    if (selectedCrew) {
      handleCrewSelect(selectedCrew);
    }
  }, [selectedCrew, currentMonth, currentYear]);

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

  const filteredCalendar = calendar.filter((crew) =>
    crew.projects?.some((proj) => proj.start_date && proj.end_date)
  );

  return (
    <div className="bg-white w-full max-w-[1126px] rounded p-4 sm:p-6 drop-shadow-md  mx-auto mb-10 mt-10">
      <div className="flex justify-center items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            className="text-[24px] font-bold hover:cursor-pointer hover:text-red-500"
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
            className="text-[24px] font-bold hover:cursor-pointer hover:text-green-500"
            onClick={handleNextMonth}
          >
            &raquo;
          </button>
        </div>
      </div>

      {calendar.length > 0 && (
        <div className={styles.calendarDiv}>
          {filteredCalendar.map((crew) => (
            <button
              key={crew.id}
              onClick={() => handleCrewSelect(crew)}
              className={`${
                styles.calendarButton
              } flex-1 px-4 py-2 rounded text-black text-[14px] 
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

          const dayEntries =
            dayColors[currentYear]?.[currentMonth]?.[date] || [];

          let bgStyle: React.CSSProperties = {};
          let borderStyle: React.CSSProperties = {};

          if (dayEntries.length === 0) {
            bgStyle.background = "white";
          } else if (dayEntries.length === 1) {
            bgStyle.background = dayEntries[0].color;
            bgStyle.color = "white";
          } else if (dayEntries.length > 1) {
            const step = 100 / dayEntries.length;
            const gradientStops = dayEntries
              .map((entry, idx) => {
                const start = step * idx;
                const end = step * (idx + 1);
                return `${entry.color} ${start}% ${end}%`;
              })
              .join(", ");

            bgStyle.background = `linear-gradient(135deg, ${gradientStops})`;
            bgStyle.color = "white";
          }
          const title =
            dayEntries.length > 0
              ? dayEntries.map((e) => `№${e.id} ${e.name}`).join(", ")
              : "";

          if (
            date === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
          ) {
            borderStyle = {
              outline: "2px solid #000000",
              outlineOffset: "-2px",
            };
          }

          return (
            <button
              key={i}
              className={`${styles.calendarDay} rounded-md  py-1 sm:py-2 mt-2 hover:scale-105 transition-transform`}
              style={{ ...bgStyle, ...borderStyle }}
              title={title}
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
