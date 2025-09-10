"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Service } from "@/types/service";
import { Material } from "@/types/material";

export interface ServiceWithQuantity extends Service {
  quantity: number;
}
export interface MaterialWithQuantity extends Material {
  quantity: number;
  previous_remaining?: number;
  additional_delivery?: number;
  current_remaining?: number;
  delivery_quantity?: number;
}

export interface ProjectPaymentDraft {
  name: string;
  description?: string;
  amount: number;
  status: "pending" | "paid" | "canceled";
  due_date: string;
}

interface ProjectCreationData {
  name: string;
  setName: (name: string) => void;

  description: string;
  setDescription: (desc: string) => void;

  clientId: number | null;
  setClientId: (id: number | null) => void;

  objectId: number | null;
  setObjectId: (id: number | null) => void;

  crewId: number | null;
  setCrewId: (id: number | null) => void;

  services: ServiceWithQuantity[];
  setServices: (services: ServiceWithQuantity[]) => void;

  materials: MaterialWithQuantity[];
  setMaterials: (materials: MaterialWithQuantity[]) => void;

  initialPayment: ProjectPaymentDraft | null;
  setInitialPayment: (payment: ProjectPaymentDraft | null) => void;

  advanceAmount: number;
  setAdvanceAmount: (amount: number) => void;

  materialsIncomeTotal: number;
  setMaterialsIncomeTotal: (income: number) => void;

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
    objectId: null,
    crewId: null,
    services: [] as ServiceWithQuantity[],
    materials: [] as MaterialWithQuantity[],
    initialPayment: null as ProjectPaymentDraft | null,
    materialsIncomeTotal: 0,
    advanceAmount: 0,
  };

  const [name, setName] = useState(initialState.name);
  const [description, setDescription] = useState(initialState.description);
  const [clientId, setClientId] = useState<number | null>(
    initialState.clientId
  );
  const [objectId, setObjectId] = useState<number | null>(null);
  const [crewId, setCrewId] = useState<number | null>(initialState.crewId);
  const [services, setServices] = useState<ServiceWithQuantity[]>(
    initialState.services
  );
  const [materials, setMaterials] = useState<MaterialWithQuantity[]>(
    initialState.materials
  );

  const [initialPayment, setInitialPayment] =
    useState<ProjectPaymentDraft | null>(initialState.initialPayment);

  const [advanceAmount, setAdvanceAmount] = useState<number>(
    initialState.advanceAmount
  );

  const [materialsIncomeTotal, setMaterialsIncomeTotal] = useState<number>(
    initialState.materialsIncomeTotal
  );

  const resetProject = () => {
    setName(initialState.name);
    setDescription(initialState.description);
    setClientId(initialState.clientId);
    setObjectId(initialState.objectId);
    setCrewId(initialState.crewId);
    setServices(initialState.services);
    setMaterials(initialState.materials);
    setInitialPayment(initialState.initialPayment);
    setMaterialsIncomeTotal(initialState.materialsIncomeTotal);
    setAdvanceAmount(initialState.advanceAmount);
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
        objectId,
        setObjectId,
        crewId,
        setCrewId,
        services,
        setServices,
        materials,
        setMaterials,
        initialPayment,
        setInitialPayment,
        advanceAmount,
        setAdvanceAmount,
        materialsIncomeTotal,
        setMaterialsIncomeTotal,
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
