"use client";

import styles from "./ProjectsDetailed.module.css";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { Client } from "@/types/client";
import { mockProjects } from "@/mock/Project/mockProjects";
import { Project } from "@/types/project";

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
