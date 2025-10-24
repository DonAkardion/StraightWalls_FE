"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./CrewCalendar.module.css";
import { getCrews } from "@/api/crews";
import { getProjectReport } from "@/api/projects";
import { Crew } from "@/types/crew";
import { useUser } from "@/context/UserContextProvider";

interface ProjectRange {
  crewId: number;
  projectId: number;
  name: string;
  start: Date;
  end: Date;
  color: string;
}

export const CrewCalendar = () => {
  const { token } = useUser();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [projects, setProjects] = useState<ProjectRange[]>([]);
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = new Date(year, month).toLocaleString("uk-UA", {
    month: "long",
    year: "numeric",
  });

  const colors: Record<string, string> = {
    new: "#0097c0",
    in_progress: "#ffb326",
    completed: "#15ae08",
    canceled: "#b70000",
  };

  // === LOAD TEAMS === //
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getCrews(token);
        setCrews(data);
      } catch (e) {
        console.error("Crew fetch error", e);
      }
    })();
  }, [token]);

  // === LOAD ALL TEAMS PROJECTS === //
  useEffect(() => {
    if (!token || crews.length === 0) return;

    (async () => {
      const projectRanges: ProjectRange[] = [];

      for (const crew of crews) {
        const validProjects = crew.projects?.filter(
          (p) => p.start_date && p.end_date
        );
        if (!validProjects?.length) continue;

        for (const proj of validProjects) {
          try {
            const report = await getProjectReport(proj.id, token);
            const color =
              colors[report.project.status as keyof typeof colors] || "#999999";
            projectRanges.push({
              crewId: crew.id,
              projectId: proj.id,
              name: report.project.name,
              start: new Date(report.project.start_date),
              end: new Date(report.project.end_date),
              color,
            });
          } catch {
            // ignore broken projects
          }
        }
      }

      setProjects(projectRanges);
    })();
  }, [crews, token]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  // === GENERATE SCHEDULE BY DAYS === //
  const schedule = useMemo(() => {
    return crews.map((crew) => {
      const crewProjects = projects.filter((p) => p.crewId === crew.id);
      const row: { start: number; end: number; color: string }[] = [];

      // calc current month blocks
      crewProjects.forEach((p) => {
        const startDay = Math.max(
          1,
          p.start.getMonth() === month ? p.start.getDate() : 1
        );
        const endDay = Math.min(
          daysInMonth,
          p.end.getMonth() === month ? p.end.getDate() : daysInMonth
        );
        if (p.start.getFullYear() === year || p.end.getFullYear() === year) {
          row.push({ start: startDay, end: endDay, color: p.color });
        }
      });
      return { crew, blocks: row };
    });
  }, [projects, crews, month, year, daysInMonth]);

  return (
    <div className="bg-white w-full rounded-t-xl  ">
      <div className={`${styles.Calendar} flex w-full rounded-xl `}>
        {/* === Left side === */}
        <div className={`${styles.CalendarControllColumn} `}>
          <div
            className={`${styles.CalendarSelect} px-2 py-3 rounded-tl-xl  flex items-center justify-center `}
          >
            <button onClick={handlePrevMonth}>&lt;</button>
            <span className="font-medium px-4">{monthName}</span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className={`${styles.CalendarCrews} `}>
            {crews.map((crew) => (
              <div
                key={crew.id}
                className="ml-2 md:ml-5 py-2 md:py-3 pr-1 md:pr-3 pl-1 text-sm md:text-base max-w-[200px] md:max-w-[240px] text-gray-700 truncate hover:bg-gray-100 border-b-1 border-r-2 border-black"
              >
                {crew.name}
              </div>
            ))}
          </div>
        </div>
        {/* === Right body === */}
        <div
          className={`${styles.CalendarBody} mb-7.5 overflow-x-auto flex-1 rounded-tr-xl`}
        >
          <div className={`min-w-max`}>
            {/* Days header */}
            <div
              className={`${styles.CalendarBodyHead} flex rounded-tr-xl pr-5`}
            >
              {days.map((d) => (
                <div
                  key={d}
                  className={`${styles.CalendarHeadDay} w-[32px] h-[48px] flex items-center justify-center sticky top-0  `}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Rows with schedules */}
            {schedule.map(({ crew, blocks }) => (
              <div
                key={crew.id}
                className="flex h-[37px] md:h-[49px] border-b-1 border-gray-600 mr-5"
              >
                {days.map((day) => {
                  const activeBlock = blocks.find(
                    (b) => day >= b.start && day <= b.end
                  );

                  return (
                    <div
                      key={day}
                      className="w-[32px] h-full border-r border-gray-200"
                      style={{
                        backgroundColor: activeBlock?.color || "#fff",
                        borderRight:
                          activeBlock && day < activeBlock.end
                            ? "none"
                            : "1px solid #e5e7eb",
                      }}
                      title={activeBlock ? crew.name : ""}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
