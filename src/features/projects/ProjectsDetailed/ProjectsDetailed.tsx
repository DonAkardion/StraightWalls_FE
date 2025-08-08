"use client";
import { useMemo } from "react";
import { mockClients } from "@/mock/Clients/clientsMock";
import styles from "./ClientsDetailed.module.css";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Client } from "@/types/client";

interface Props {
  clientId: string;
}

export function ProjectsDetailed({ clientId }: Props) {
  const client = mockClients.find((c) => c.id === clientId);
import { mockProjects } from "@/mock/Project/mockProjects";

interface Props {
  projectId: string;
}

export function ProjectsDetailed({ projectId }: Props) {
  const client = mockProjects.find((c) => c.id === projectId);

  if (!client) {
    return <div>ProjectsDetailed не знайдено</div>;
  }

  return <div className="pl-[10px] pr-[10px] pt-[76px]"></div>;
}
}