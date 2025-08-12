"use client";
import React, { useState } from "react";
import styles from "./AddProject.module.css";
import { ClientSelector } from "@/components/addProject/ClientSelector/ClientSelector";
import { mockClients } from "@/mock/Clients/clientsMock";

export function AddProject() {
  const [clientId, setClientId] = useState<string | null>(null);
  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div
        className={`${styles.selector} flex flex-col md:flex-row items-center gap-[15px] md:gap-[22px] mb-[30px]`}
      >
        <span className={`${styles.selectorTytle} whitespace-nowrap `}>
          ПІБ клієнта
        </span>
        <ClientSelector
          clients={mockClients}
          value={clientId}
          onChange={setClientId}
        />
      </div>
      {/* {clientId && (
        <p className="mt-4 text-gray-600">
          Обраний клієнт: {mockClients.find((c) => c.id === clientId)?.name}
        </p>
      )} */}
      <div>CostEstimate</div>
      <div>MaterialEarnings</div>
      <button>Send</button>
    </section>
  );
}
