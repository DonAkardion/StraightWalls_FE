"use client";

import React, { createContext, useContext, useState } from "react";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";

interface CrewContextType {
  crews: Crew[];
  workers: Worker[];
  addCrew: (crew: Crew) => void;
  addWorker: (worker: Worker) => void;
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
}

const CrewContext = createContext<CrewContextType | undefined>(undefined);

export const CrewProvider = ({ children }: { children: React.ReactNode }) => {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const addCrew = (crew: Crew) => setCrews((prev) => [...prev, crew]);
  const addWorker = (worker: Worker) => setWorkers((prev) => [...prev, worker]);

  return (
    <CrewContext.Provider value={{ crews, workers, addCrew, addWorker, setWorkers }}>
      {children}
    </CrewContext.Provider>
  );
};

export const useCrew = () => {
  const ctx = useContext(CrewContext);
  if (!ctx) throw new Error("useCrew must be used inside CrewProvider");
  return ctx;
};
