"use client";
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { getClients } from "@/api/clients";
import { Client } from "@/types/client";
import { useUser } from "@/context/UserContextProvider";
import { useRouter } from "next/navigation";
import { Search } from "../../../../public/icons";

type Props = {
  role: string;
};

export const HeaderSearch = ({ role }: Props) => {
  const { token } = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token || !query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const clients = await getClients(token, { search: query });
        setResults(clients);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query, token]);

  return (
    <div className={` ${styles.searchContainer} relative w-full max-w-[484px]`}>
      <div className="flex items-center border rounded pl-3 pr-3">
        <input
          type="text"
          placeholder="Пошук"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${styles.searchInput} w-full h-[50px] outline-none`}
        />
        <img src={Search.src} alt="Search" className="w-[36px] [36px] ml-2" />
      </div>

      {results.length > 0 && (
        <div className="absolute mt-[8px] top-full left-0 right-0 bg-white border z-50 max-h-60 overflow-y-auto rounded">
          {results.map((client) => (
            <div
              key={client.id}
              className="p-2 pl-[16px] hover:bg-gray-100 cursor-pointer flex gap-3"
              onClick={() => {
                router.push(`/${role}/clients/clientsDetailed/${client.id}`);
                setQuery("");
              }}
            >
              <div>{client.full_name}</div>
              <div>{client.phone_number}</div>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div className="absolute top-full left-0 p-2 text-gray-500">
          Завантаження...
        </div>
      )}
    </div>
  );
};
