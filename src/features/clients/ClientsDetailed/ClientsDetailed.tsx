"use client";
import { useMemo } from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import styles from "./ClientsDetailed.module.css";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Client } from "@/types/client";

export function ClientsDetailed() {
  return <div className={styles.clientsDetailed}></div>;
}
