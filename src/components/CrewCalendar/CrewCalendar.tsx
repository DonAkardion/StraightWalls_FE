"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CrewCalendar.module.css";
import { getCrews } from "@/api/crews";
import { getProjectReport } from "@/api/projects";
import { Crew } from "@/types/crew";
import { useUser } from "@/context/UserContextProvider";

interface ProjectRange {
  crewId: number;
  projectId: number;
  objectId: number;
  objectName: string;
  name: string;
  address: string;
  clientPhone: string;
  start: Date;
  end: Date;
  color: string;
}

interface MonthSegment {
  projectId: number;
  objectId: number;
  objectName: string;
  name: string;
  address: string;
  clientPhone: string;
  color: string;
  startDay: number;
  endDay: number;
  lane: number;
}

const CELL_W = 32;
const ROW_H = 49;
const LANE_GAP = 4;
const MAX_LANES = 3;

export const CrewCalendar = () => {
  const { token } = useUser();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [projects, setProjects] = useState<ProjectRange[]>([]);
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const scrollRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    x: number;
    y: number;
  }>({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  // === Month setup ===
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
              objectId: report.project.object.id,
              objectName: report.project.object.name,
              name: report.project.name,
              address: report.project.object.address,
              clientPhone: report.project.client.phone_number,
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

  // === helpers ===
  const clipToMonth = (p: ProjectRange) => {
    // якщо проєкт взагалі не перетинає поточний місяць/рік — повернемо null
    const projectStart = new Date(p.start);
    const projectEnd = new Date(p.end);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month, daysInMonth, 23, 59, 59, 999);

    if (projectEnd < monthStart || projectStart > monthEnd) return null;

    const segStart = projectStart < monthStart ? monthStart : projectStart;
    const segEnd = projectEnd > monthEnd ? monthEnd : projectEnd;

    const startDay = Math.max(1, segStart.getDate());
    const endDay = Math.min(daysInMonth, segEnd.getDate());

    if (startDay > endDay) return null;

    return { startDay, endDay };
  };

  // Призначення доріжок (щоб розвести перетини у висоту)
  const assignLanes = (
    segments: Omit<MonthSegment, "lane">[]
  ): MonthSegment[] => {
    // жадібно розкладаємо
    const lanesEnd: number[] = []; // останній зайнятий день у кожній доріжці
    const withLane: MonthSegment[] = [];

    segments
      .sort((a, b) => a.startDay - b.startDay || a.endDay - b.endDay)
      .forEach((seg) => {
        let placed = false;
        for (let i = 0; i < Math.min(lanesEnd.length, MAX_LANES); i++) {
          if (seg.startDay > lanesEnd[i]) {
            lanesEnd[i] = seg.endDay;
            withLane.push({ ...seg, lane: i });
            placed = true;
            break;
          }
        }
        if (!placed) {
          const laneIndex = Math.min(lanesEnd.length, MAX_LANES - 1);
          lanesEnd[laneIndex] = seg.endDay;
          withLane.push({ ...seg, lane: laneIndex });
        }
      });

    return withLane;
  };

  // === GENERATE SCHEDULE BARS PER CREW === //
  const schedule = useMemo(() => {
    return crews.map((crew) => {
      const crewProjects = projects.filter((p) => p.crewId === crew.id);

      const monthSegments: Omit<MonthSegment, "lane">[] = [];
      crewProjects.forEach((p) => {
        const clipped = clipToMonth(p);
        if (!clipped) return;
        monthSegments.push({
          projectId: p.projectId,
          objectId: p.objectId,
          objectName: p.objectName,
          name: p.name,
          address: p.address,
          clientPhone: p.clientPhone,
          color: p.color,
          startDay: clipped.startDay,
          endDay: clipped.endDay,
        });
      });

      const withLanes = assignLanes(monthSegments);
      const lanesCount =
        withLanes.length === 0
          ? 0
          : Math.max(...withLanes.map((s) => s.lane)) + 1;

      return { crew, segments: withLanes, lanesCount };
    });
  }, [projects, crews, month, year, daysInMonth]);

  const laneHeight = (lanesCount: number) => {
    if (lanesCount <= 1) return ROW_H;
    const totalGaps = (lanesCount - 1) * LANE_GAP;
    return Math.max(20, Math.floor((ROW_H - totalGaps) / lanesCount));
  };

  // === Drag-scroll logic ===
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const mouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
    const mouseLeave = () => (isDown = false);
    const mouseUp = () => (isDown = false);
    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1; // scroll speed
      container.scrollLeft = scrollLeft - walk;
    };
    container.addEventListener("mousedown", mouseDown);
    container.addEventListener("mouseleave", mouseLeave);
    container.addEventListener("mouseup", mouseUp);
    container.addEventListener("mousemove", mouseMove);
    return () => {
      container.removeEventListener("mousedown", mouseDown);
      container.removeEventListener("mouseleave", mouseLeave);
      container.removeEventListener("mouseup", mouseUp);
      container.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  // === Tooltip positioning ===
  const showTooltip = (text: string, e: React.MouseEvent) => {
    const rect = scrollRef.current?.getBoundingClientRect();
    setTooltip({
      visible: true,
      text,
      x: e.clientX - (rect?.left ?? 0) + 10,
      y: e.clientY - (rect?.top ?? 0) + 10,
    });
  };

  const hideTooltip = () => setTooltip((t) => ({ ...t, visible: false }));

  return (
    <div className="bg-white w-full rounded-t-xl relative">
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          ref={tooltipRef}
          className={`${styles.Tooltip} absolute z-50 bg-gray-900 text-white text-base px-3 py-2 rounded-xl pointer-events-none`}
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
      <div className={`${styles.Calendar} flex w-full rounded-xl `}>
        {/* === Left side === */}
        <div className={`${styles.CalendarControllColumn} flex flex-col`}>
          <div
            className={`${styles.CalendarSelect} px-2 py-3 rounded-tl-xl  flex items-center justify-center `}
          >
            <button onClick={handlePrevMonth}>&lt;</button>
            <span className="font-medium px-4">{monthName}</span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className={`${styles.CalendarCrews} h-full`}>
            {schedule.map(({ crew, lanesCount }) => (
              <div
                key={crew.id}
                className=" ml-2 md:ml-5 pr-1 md:pr-3 pl-1 text-sm md:text-base max-w-[200px] md:max-w-[240px] text-gray-700 hover:bg-gray-100 border-b-1 border-r-2 border-black flex items-center"
                style={{
                  height:
                    lanesCount > 2 ? ROW_H + (lanesCount - 2) * 20 : ROW_H,
                }}
              >
                <span className="truncate">{crew.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* === Right body === */}
        <div
          ref={scrollRef}
          className={`${styles.CalendarBody} mb-3 md:mb-5 overflow-x-auto flex-1 rounded-tr-xl cursor-grab active:cursor-grabbing`}
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
            {schedule.map(({ crew, segments, lanesCount }) => {
              const lh = laneHeight(lanesCount);
              const rowHeight =
                lanesCount > 2 ? ROW_H + (lanesCount - 2) * 20 : ROW_H;
              return (
                <div
                  key={crew.id}
                  className="relative mr-5 border-b border-gray-600"
                  style={{ height: rowHeight }}
                >
                  {/* Grid */}
                  <div className="flex h-full">
                    {days.map((d) => (
                      <div
                        key={d}
                        className="w-[32px] h-full border-r border-gray-200"
                      />
                    ))}
                  </div>

                  {/* Overlay-Bars projects */}
                  <div className="absolute inset-0 ">
                    {segments.map((seg) => {
                      const widthPx = (seg.endDay - seg.startDay + 1) * CELL_W;
                      const leftPx = (seg.startDay - 1) * CELL_W;
                      const topPx =
                        seg.lane * lh +
                        (seg.lane > 0 ? seg.lane * LANE_GAP : 0);

                      return (
                        <div
                          key={`${seg.projectId}-${seg.lane}`}
                          className="absolute flex items-center justify-center px-2 overflow-hidden"
                          style={{
                            left: leftPx,
                            top: topPx,
                            width: widthPx,
                            height: lh,
                            backgroundColor: seg.color,
                            borderRadius: 8,
                            color: "#fff",
                            fontSize: 12,
                            lineHeight: 1,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                          onMouseEnter={(e) =>
                            // showTooltip(
                            //   ` №${seg.projectId} ${seg.name} / ${seg.address} /
                            // ${seg.clientPhone}`,
                            //   e
                            // )
                            showTooltip(
                              ` № ${seg.objectId} ${seg.objectName}`,
                              e
                            )
                          }
                          onMouseLeave={hideTooltip}
                          // title={seg.name}
                        >
                          <span className="truncate w-full text-center">
                            {/* №{seg.projectId} {seg.name} / {seg.address} /{" "}
                            {seg.clientPhone} */}
                            №{seg.objectId} {seg.objectName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
