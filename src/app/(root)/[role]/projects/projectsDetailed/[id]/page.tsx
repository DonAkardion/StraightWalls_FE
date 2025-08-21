import React from "react";
import { ProjectsDetailed } from "@/features/projects/ProjectsDetailed/ProjectsDetailed";

interface ProjectsDetailedPageProps {
  params: Promise<{
    role: string;
    id: number;
  }>;
}

export default async function ProjectsDetailedPage({
  params,
}: ProjectsDetailedPageProps) {
  const { id } = await params;
  return <ProjectsDetailed projectId={id} />;
}
