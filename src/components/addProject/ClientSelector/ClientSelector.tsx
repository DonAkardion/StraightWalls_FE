"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./ClientSelector.module.css";
import { Client } from "@/types/client";

interface ClientSelectorProps {
  clients: Client[];
  value: string | null;
  onChange: (clientId: string | null) => void;
  placeholder?: string;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  value,
  onChange,
  placeholder = "Введіть ПІБ",
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find((c) => c.id === value);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    return clients.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [clients, search]);

  const handleSelect = (clientId: string) => {
    onChange(clientId);
    setOpen(false);
    setSearch("");
  };

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

  return (
    <div
      className={`${styles.selectorContainer} relative w-full`}
      ref={containerRef}
    >
      <div
        className="border rounded p-[20px] md:px-[40px] md:py-[16px] w-full bg-white cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedClient ? (
          selectedClient.name
        ) : (
          <span className={`${styles.selectorPlaceholder}`}>{placeholder}</span>
        )}
      </div>

      {open && (
        <div className="absolute top-0 left-0 right-0 bg-white border rounded-[5px] shadow-lg z-10">
          <input
            type="text"
            className="w-full border-b p-[20px] md:px-[30px] md:py-[16px] outline-none"
            placeholder="Пошук клієнта..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <li
                  key={client.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(client.id)}
                >
                  {client.name}
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
