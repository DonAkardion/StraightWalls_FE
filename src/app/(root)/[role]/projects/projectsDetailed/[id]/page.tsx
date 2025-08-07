import { ProjectsDetailed } from "@/features/projects/ProjectsDetailed/ProjectsDetailed";

interface Params {
  role: string;
  id: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function ProjectsDetailedPage({ params }: Props) {
  const awaitedParams = await params;

  return <ProjectsDetailed clientId={awaitedParams.id} />;
}
