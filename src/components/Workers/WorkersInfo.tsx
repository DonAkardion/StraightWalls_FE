"use client";
import React from "react";
import { mockWorkers } from "@/mock/Workers/workersMock";
import { mockCrews } from "@/mock/Crew/crewMock";
import { InfoCard } from "@/components/Info/InfoCard";

export const WorkersInfo = () => {
  const totalWorkers = mockWorkers.length;
  const totalCrews = mockCrews.length;

  const freeCrews = mockCrews.filter((crew) => crew.brigadier === null).length;
  const busyCrews = totalCrews - freeCrews;

  return (
    <div className=" w-full flex flex-col md:flex-row gap-[24px] mb-[40px] md-[60px]">
      <InfoCard label="Кількість робітників" value={totalWorkers} />
      <InfoCard label="Кількість бригад" value={totalCrews} />
      <InfoCard label="Вільно бригад" value={freeCrews} />
      <InfoCard label="Зайнятих бригад" value={busyCrews} />
    </div>
  );
};
