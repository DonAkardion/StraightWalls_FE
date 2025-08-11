import { ProjectsHeaders } from "@/features/projects/ProjectHeaders"
import { InteractionsMessage } from "./ClientsInteraction"


export const ClientsInteraction = () => {
    return (
        <div className="mb-20">
            <ProjectsHeaders
                headers={["Взаємодія з клієнтом"]}
                className="text-black text-[32px] mt-10 ml-27 font-inter"
            />
            <InteractionsMessage />
        </div>
    )
}