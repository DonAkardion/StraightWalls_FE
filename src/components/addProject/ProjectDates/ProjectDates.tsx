"use client";
import React, { useState, useEffect } from "react";
import styles from "./ProjectDates.module.css";
interface Props {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export const ProjectDates = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError("Дата завершення не може бути раніше дати початку");
    } else {
      setError(null);
    }
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-[16px] mb-[30px] w-full">
      <div
        className={`${styles.datesTytle} whitespace-nowrap shrink-0 md:w-[calc(30%-15px)]`}
      >
        Термін
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {/* Дата початку */}
        <div className="flex flex-col items-center md:items-start">
          <label className={`${styles.datesText} mb-1 whitespace-nowrap`}>
            Дата початку
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={`w-full h-[46px] border rounded px-3 py-2 cursor-pointer  ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {/* Дата кінця */}
        <div className="flex flex-col items-center md:items-start">
          <label className={`${styles.datesText} mb-1 whitespace-nowrap`}>
            Дата кінця
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className={`w-full h-[46px] border rounded px-3 py-2 cursor-pointer ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
      </div>
    </div>
  );
};
