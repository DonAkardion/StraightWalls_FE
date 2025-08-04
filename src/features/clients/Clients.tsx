"use client";
import { useMemo } from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import styles from "./Clients.module.css";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Client } from "@/types/client";

export function Clients() {
  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[250px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[60px]`}
    ></section>
  );
}
