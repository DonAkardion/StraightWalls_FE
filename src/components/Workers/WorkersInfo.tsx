"use client";
import React from "react";
import { InfoCard } from "@/components/Info/InfoCard";
import { Crew } from "@/types/crew";
import { Worker } from "@/types/worker";

interface WorkersInfoProps {
  crews: Crew[];
  workers: Worker[];
}

export const WorkersInfo = ({ crews, workers }: WorkersInfoProps) => {
  const totalCrews = crews.length;
  const totalWorkers = workers.length;
  const freeCrews = crews.filter((crew) => !crew.projects || crew.projects.length === 0).length;
  const busyCrews = crews.filter((crew) => crew.projects && crew.projects.length > 0).length;



  return (
    <div className="w-full flex flex-col md:flex-row gap-[24px] mb-[40px] md-[60px]">
      <InfoCard label="Кількість робітників" value={totalWorkers} />
      <InfoCard label="Кількість бригад" value={totalCrews} />
      <InfoCard label="Вільно бригад" value={freeCrews} />
      <InfoCard label="Зайнятих бригад" value={busyCrews} />
    </div>
  );
};
