"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Material } from "@/types/material";
// import { Crew } from "@/types/crew";
// import { Worker } from "@/types/worker";
import { Service } from "@/types/service";

interface ProjectCreationData {
  clientId: string | null;
  setClientId: (id: string | null) => void;

  services: Service[];
  setServices: (services: Service[]) => void;

  materials: Material[];
  setMaterials: (materials: Material[]) => void;

  crewId: string | null;
  setCrewId: (id: string | null) => void;

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
    clientId: null,
    services: [],
    materials: [],
    crewId: null,
  };
  const [clientId, setClientId] = useState<string | null>(
    initialState.clientId
  );
  const [services, setServices] = useState<Service[]>(initialState.services);
  const [materials, setMaterials] = useState<Material[]>(
    initialState.materials
  );
  const [crewId, setCrewId] = useState<string | null>(initialState.crewId);

  const resetProject = () => {
    setClientId(initialState.clientId);
    setServices(initialState.services);
    setMaterials(initialState.materials);
    setCrewId(initialState.crewId);
  };

  return (
    <ProjectCreationContext.Provider
      value={{
        clientId,
        setClientId,
        services,
        setServices,
        materials,
        setMaterials,
        crewId,
        setCrewId,
        resetProject,
      }}
    >
      {children}
    </ProjectCreationContext.Provider>
  );
};

export const useProjectCreation = () => {
  const context = useContext(ProjectCreationContext);
  if (!context) {
    throw new Error(
      "useProjectCreation must be used within ProjectCreationProvider"
    );
  }
  return context;
};
