"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./CrewSelector.module.css";
import { Crew } from "@/types/crew";
import { getCrews } from "@/api/crews";
import { useUser } from "@/context/UserContextProvider";

interface CrewSelectorProps {
  value: number | null;
  onChange: (crewId: number | null) => void;
  placeholder?: string;
}

export const CrewSelector: React.FC<CrewSelectorProps> = ({
  value,
  onChange,
  placeholder = "Пошук бригади",
}) => {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { token } = useUser();

  useEffect(() => {
    if (!token) return;
    getCrews(token).then(setCrews);
  }, [token]);

  const selectedCrew = crews.find((c) => c.id === value);

  const filteredCrews = useMemo(() => {
    if (!search.trim()) return crews;
    return crews.filter((c) =>
      (c.name ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [crews, search]);

  const handleSelect = (crewId: number) => {
    onChange(crewId);
    setOpen(false);
    setSearch("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`${styles.selectorContainer} relative w-full`}
      ref={containerRef}
    >
      <div
        className="border rounded p-[20px] md:px-[40px] md:py-[16px] w-full bg-white cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedCrew ? (
          selectedCrew.name
        ) : (
          <span className={`${styles.selectorPlaceholder}`}>{placeholder}</span>
        )}
      </div>
      <div className={styles.dropdownPanel}>
        <div
          className={` absolute top-0 left-0 right-0 bg-white border rounded-[5px] shadow-lg z-10 ${
            open ? styles.dropdownOpen : styles.dropdownClosed
          }`}
        >
          <input
            type="text"
            className="w-full border-b p-[20px] md:px-[30px] md:py-[16px] outline-none"
            placeholder="Пошук Бригади"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredCrews.length > 0 ? (
              filteredCrews.map((crew) => (
                <li
                  key={crew.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(crew.id)}
                >
                  {crew.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400">Нічого не знайдено</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
