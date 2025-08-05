import { ClientsDetailed } from "@/features/clients/ClientsDetailed/ClientsDetailed";

interface Props {
  params: {
    role: string;
    id: string;
  };
}

export default function ClientsDetailedPage({ params }: Props) {
  return <ClientsDetailed clientId={params.id} />;
}
