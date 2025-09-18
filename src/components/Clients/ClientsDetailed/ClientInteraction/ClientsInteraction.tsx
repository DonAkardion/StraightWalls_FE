import { ClientsText } from "@/features/clients/ClientsText/ClientsText";
import { clientsInteractions } from "@/mock/clientsInteraction";
import React from "react";

export const InteractionsMessage = () => {
  return (
    <div className="w-full m-auto border border-[#FFB326] px-8 py-4 rounded mt-3">
      {clientsInteractions.map((interaction, index) => (
        <ClientsText
          key={index}
          clientsText={[interaction.data, interaction.description]}
          className="text-black text-[16px] font-inter"
        />
      ))}
    </div>
  );
};
