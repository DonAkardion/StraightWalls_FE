import React from "react";
import { DriversBalance } from "@/components/HomePage/DriversBalance/DriversBalance";
import { InProgress } from "@/components/HomePage/InProgress/InProgress";

export default function WorkerHomePage() {
  return (
    <section className="flex flex-col max-w-[1126px] mx-auto pt-[24px] pr-[20px] pb-[40px] pl-[20px] md:pt-[64px] md:pr-[60px] md:pb-[76px] md:pl-[80px]">
      {/* тут будуть Worker-модулі */}
      <DriversBalance items={[{ label: "Олег Петрович", value: "1 057,5" }]} />
      <InProgress />
    </section>
  );
}
