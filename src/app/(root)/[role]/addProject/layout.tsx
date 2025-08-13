import React, { ReactNode } from "react";
import { ProjectCreationProvider } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";

export default function AddProjectLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProjectCreationProvider>{children}</ProjectCreationProvider>;
}
