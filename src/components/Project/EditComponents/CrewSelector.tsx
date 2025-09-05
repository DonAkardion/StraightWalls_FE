"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./CrewSelector.module.css";
import { Crew } from "@/types/crew";

interface CrewSelectorProps {
  crews: Crew[];
  value: number | null;
  onChange: (crewId: number | null) => void;
  placeholder?: string;
}

export const CrewSelector: React.FC<CrewSelectorProps> = ({
  crews,
  value,
  onChange,
  placeholder = "Виберіть бригаду",
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCrew = crews.find((c) => c.id === value);

  const filteredCrews = useMemo(() => {
    if (!search.trim()) return crews;
    return crews.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
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
        className="border rounded px-4 py-2 bg-white cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedCrew ? (
          selectedCrew.name
        ) : (
          <span className={styles.selectorPlaceholder}>{placeholder}</span>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg z-10 mt-1">
          <input
            type="text"
            className="w-full border-b px-3 py-2 outline-none"
            placeholder="Пошук бригади..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-[200px] overflow-y-auto">
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
      )}
    </div>
  );
};
