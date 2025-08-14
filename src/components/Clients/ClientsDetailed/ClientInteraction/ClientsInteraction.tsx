import { ClientsText } from "@/features/clients/ClientsText/ClientsText";
import { clientsInteractions } from "@/mock/Clients/clientsInteraction";
import styles from "./ClientsInteraction.module.css";

export const InteractionsMessage = () => {
  return (
    <div
      className={`${styles.interactionDiv} border border-[#FFB326] px-8 py-4 rounded mt-3 max-w-full`}
    >
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
