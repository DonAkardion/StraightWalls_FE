"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./StatusSelector.module.css";
import tableStyles from "@/components/Table/Table.module.css";

interface StatusSelectorProps {
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
}

export const StatusSelector = ({
  value,
  options,
  onChange,
}: StatusSelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(key);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return tableStyles.completedRow;
      case "in_progress":
        return tableStyles.inprogressRow;
      case "new":
        return tableStyles.waitingRow;
      case "canceled":
        return tableStyles.canceledRow;
      default:
        return "";
    }
  };

  return (
    <div
      ref={ref}
      className={styles.selector}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
      }}
    >
      <div
        className={`${styles.selected} ${getStatusClass(value)}  text-center`}
      >
        {options[value] ?? "—"}
      </div>
      {open && (
        <div className={styles.dropdown}>
          {Object.entries(options).map(([key, label]) => (
            <div
              key={key}
              className={`${styles.option} ${getStatusClass(key)} ${
                key === value ? styles.active : ""
              } text-center`}
              onClick={(e) => handleSelect(key, e)}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
