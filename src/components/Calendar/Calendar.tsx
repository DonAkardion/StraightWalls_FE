import React from "react";
import styles from "./Calendar.module.css";

const info = [
  "Ств Горкуша",
  "Ств Горкуша",
  "Ств Горкуша",
  "Ств Горкуша",
  "Ств Горкуша",
  "Липень",
];
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

const getColorClass = (date: number) => {
  if ([2, 3, 4, 5].includes(date)) return "bg-[#0097C0] text-white";
  if ([8, 9, 10, 11, 12, 15, 16, 17, 18, 19].includes(date))
    return "bg-[#FFB326]";
  if (date === 31 || date === 30) return "bg-[#BD0F0F] text-white";
  return "bg-[#FFFFFF] text-black";
};

export const Calendar = () => {
  return (
    <div className="bg-white  w-full rounded p-4 sm:p-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] font-inter mx-auto mb-10 ">
      <div className={`${styles.calendarDiv}`}>
        {info.map((text, idx) => (
          <button
            key={idx}
            className={`${styles.calendarButton} flex-1 px-6 py-2 rounded text-black text-[12px] bg-[linear-gradient(90deg,rgba(255,179,38,0.5)_36.06%,rgba(191,117,42,0.5)_100%)] hover:[background-image:none] hover:border hover:border-[#FFB326] hover:cursor-pointer`}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[12px] sm:text-[14px]">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="font-medium pb-1 border-b text-black text-[12px] sm:text-[14px] md:text-[18px]"
          >
            <span className="inline xl:hidden">{day.slice(0, 1)}</span>
            <span className="hidden xl:inline">{day}</span>
          </div>
        ))}

        {dates.flat().map((date, i) => (
          <button
            key={i}
            className={`rounded-md shadow-md py-1 sm:py-2 ${getColorClass(
              date
            )} text-[12px] sm:text-[13px] mt-2 hover:cursor-pointer`}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  );
};
