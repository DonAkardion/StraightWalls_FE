import React from "react";
import { Balance } from "@/components/HomePage/Balance/Balance";
import { DriversBalance } from "@/components/HomePage/DriversBalance/DriversBalance";
import { Debtors } from "@/components/HomePage/Debtors/Debtors";
import { InProgress } from "@/components/HomePage/InProgress/InProgress";
export default function AdminHomePage() {
  return (
    <section className="flex flex-col max-w-[1126px] mx-auto pt-[24px] pr-[20px] pb-[40px] pl-[20px] md:pt-[64px] md:pr-[60px] md:pb-[76px] md:pl-[80px]">
      <Balance
        items={[
          { label: "Гроші в касі", value: "345" },
          { label: "Борг", value: "12 000" },
          { label: "Заробіток на роботі", value: "30 000" },
          { label: "Заробіток на матеріалах", value: "10 000" },
        ]}
      />
      <DriversBalance
        items={[
          { label: "Олег Петрович", value: "1 057,5" },
          { label: "Максим Іванович", value: "10 057,5" },
          { label: "Олекса Володимирович", value: "157,5" },
        ]}
      />
      <InProgress />
      <Debtors
        items={[
          { label: "Cr.2 Cau Tapi", value: "12 057,5" },
          { label: "Cr.2 Cau Tapi", value: "10 057,5" },
          { label: "Cr.2 Cau Tapi", value: "157,5 грн" },
          { label: "Cr.2 Cau Tapi", value: "157,5 грн" },
        ]}
      />
    </section>
  );
}
