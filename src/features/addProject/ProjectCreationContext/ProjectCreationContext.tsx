"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProjectMaterial } from "@/types/projectComponents";
import { Service } from "@/types/service";

export interface ServiceWithQuantity extends Service {
  quantity: number;
}

interface ProjectCreationData {
  name: string;
  setName: (name: string) => void;

  description: string;
  setDescription: (desc: string) => void;

  clientId: number | null;
  setClientId: (id: number | null) => void;

  crewId: number | null;
  setCrewId: (id: number | null) => void;

  services: ServiceWithQuantity[];
  setServices: (services: ServiceWithQuantity[]) => void;

  materials: ProjectMaterial[];
  setMaterials: (materials: ProjectMaterial[]) => void;

  resetProject: () => void;
}

const ProjectCreationContext = createContext<ProjectCreationData | undefined>(
  undefined
);

export const ProjectCreationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const initialState = {
    name: "",
    description: "",
    clientId: null,
    crewId: null,
    services: [] as ServiceWithQuantity[],
    materials: [] as ProjectMaterial[],
  };

  const [name, setName] = useState(initialState.name);
  const [description, setDescription] = useState(initialState.description);
  const [clientId, setClientId] = useState<number | null>(
    initialState.clientId
  );
  const [crewId, setCrewId] = useState<number | null>(initialState.crewId);
  const [services, setServices] = useState<ServiceWithQuantity[]>(
    initialState.services
  );
  const [materials, setMaterials] = useState<ProjectMaterial[]>(
    initialState.materials
  );

  const resetProject = () => {
    setName(initialState.name);
    setDescription(initialState.description);
    setClientId(initialState.clientId);
    setCrewId(initialState.crewId);
    setServices(initialState.services);
    setMaterials(initialState.materials);
  };

  return (
    <ProjectCreationContext.Provider
      value={{
        name,
        setName,
        description,
        setDescription,
        clientId,
        setClientId,
        crewId,
        setCrewId,
        services,
        setServices,
        materials,
        setMaterials,
        resetProject,
      }}
    >
      {children}
    </ProjectCreationContext.Provider>
  );
};

export const useProjectCreation = () => {
  const context = useContext(ProjectCreationContext);
  if (!context)
    throw new Error(
      "useProjectCreation must be used within ProjectCreationProvider"
    );
  return context;
};
