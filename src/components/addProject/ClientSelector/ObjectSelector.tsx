"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { ClientObject } from "@/types/client";
import styles from "./ClientSelector.module.css";

interface Props {
  objects: ClientObject[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
}

export const ObjectSelector: React.FC<Props> = ({
  objects,
  value,
  onChange,
  placeholder = "Виберіть об’єкт",
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = objects.find((o) => o.id === value);

  // Встановлюємо перший об'єкт автоматично, якщо value ще не встановлено
  useEffect(() => {
    if (!value && objects.length > 0) {
      onChange(objects[0].id);
    }
  }, [objects, value, onChange]);

  // Фільтруємо об'єкти по пошуку
  const filteredObjects = useMemo(() => {
    if (!search.trim()) return objects;
    return objects.filter(
      (o) =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [objects, search]);

  // Закривати при кліку поза
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

  const handleSelect = (id: number) => {
    onChange(id);
    setOpen(false);
    setSearch("");
  };

  return (
    <div
      className={`${styles.selectorContainer} relative w-[70%]`}
      ref={containerRef}
    >
      <div
        className="border rounded p-[20px] md:px-[40px] md:py-[16px] w-full bg-white cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selected ? (
          <span className={`${styles.selectorPlaceholder}`}>
            {selected.name}: {selected.address}
          </span>
        ) : (
          <span className={`${styles.selectorPlaceholder}`}>{placeholder}</span>
        )}
      </div>
      <div className={styles.dropdownPanel}>
        <div
          className={`absolute top-0 left-0 right-0 bg-white border rounded-[5px] shadow-lg z-10 ${
            open ? styles.dropdownOpen : styles.dropdownClosed
          }`}
        >
          <input
            type="text"
            className="w-full border-b p-[20px] md:px-[30px] md:py-[16px] outline-none"
            placeholder="Пошук об'єкта..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredObjects.length > 0 ? (
              filteredObjects.map((obj) => (
                <li
                  key={obj.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(obj.id)}
                >
                  {obj.name}: {obj.address}
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
