import React from "react";
import { ProjectsDetailed } from "@/features/projects/ProjectsDetailed/ProjectsDetailed";

interface Params {
  role: string;
  id: string;
}

interface Props {
  params: Params;
}

export default async function ProjectsDetailedPage({ params }: Props) {
  const awaitedParams = params;
  return <ProjectsDetailed clientId={awaitedParams.id} />;
}
