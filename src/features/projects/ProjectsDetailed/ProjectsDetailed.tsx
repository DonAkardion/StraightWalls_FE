"use client";

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
