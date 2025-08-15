"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";
import { mockCrews } from "@/mock/Crew/crewMock";
import { mockWorkers } from "@/mock/Workers/workersMock";


interface CrewContextType {
  crews: Crew[];
  workers: Worker[];
  addCrew: (crew: Crew) => void;
}

const CrewContext = createContext<CrewContextType | undefined>(undefined);

export function CrewProvider({ children }: { children: ReactNode }) {
  const [crews, setCrews] = useState<Crew[]>(mockCrews);
  const [workers] = useState<Worker[]>(mockWorkers);

  const addCrew = (crew: Crew) => {
    setCrews((prev) => [...prev, crew]);
  };

  return (
    <CrewContext.Provider value={{ crews, workers, addCrew }}>
      {children}
    </CrewContext.Provider>
  );
}

export function useCrew() {
  const ctx = useContext(CrewContext);
    if (!ctx) {
        throw new Error("useCrew must be used inside CrewProvider");
    }
  return ctx;
}

