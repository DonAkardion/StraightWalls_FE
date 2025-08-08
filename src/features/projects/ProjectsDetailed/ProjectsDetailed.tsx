"use client";
import React from "react";
import { mockProjects } from "@/mock/Project/mockProjects";

interface Props {
  projectId: string;
}

export function ProjectsDetailed({ projectId }: Props) {
  const project = mockProjects.find((c) => c.id === projectId);

  if (!project) {
    return <div>ProjectsDetailed не знайдено</div>;
  }

  return <div className="pl-[10px] pr-[10px] pt-[76px]"></div>;
}
