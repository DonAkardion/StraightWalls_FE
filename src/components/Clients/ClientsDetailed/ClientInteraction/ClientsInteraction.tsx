import { ClientsText } from "@/features/clients/ClientsText/ClientsText"
import { clientsInteractions } from "@/mock/Clients/clientsInteraction"


export const InteractionsMessage = () => {
    return (
        <div className="max-w-[990px] m-auto border border-[#FFB326] px-8 py-4 rounded mt-3">
            {clientsInteractions.map((interaction, index) => (
                <ClientsText
                    key={index}
                    clientsText={[interaction.data, interaction.description]}
                    className="text-black text-[16px] font-inter"
                />
            ))}
        </div>
    )
}