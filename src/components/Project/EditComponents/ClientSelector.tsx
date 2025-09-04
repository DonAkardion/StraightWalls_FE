"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./ClientSelector.module.css";
import { Client } from "@/types/client";

interface ClientSelectorProps {
  clients: Client[];
  value: number | null;
  onChange: (clientId: number | null) => void;
  placeholder?: string;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  value,
  onChange,
  placeholder = "Виберіть клієнта",
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find((c) => c.id === value);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    return clients.filter((c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [clients, search]);

  const handleSelect = (clientId: number) => {
    onChange(clientId);
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
        {selectedClient ? (
          selectedClient.full_name
        ) : (
          <span className={styles.selectorPlaceholder}>{placeholder}</span>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg z-10 mt-1">
          <input
            type="text"
            className="w-full border-b px-3 py-2 outline-none"
            placeholder="Пошук клієнта..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-[200px] overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <li
                  key={client.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(client.id)}
                >
                  {client.full_name}
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
