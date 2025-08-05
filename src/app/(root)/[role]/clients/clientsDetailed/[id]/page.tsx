import { ClientsDetailed } from "@/features/clients/ClientsDetailed/ClientsDetailed";

interface Props {
  params: {
    role: string;
    id: string;
  };
}

export default function ClientsDetailedPage({ params }: Props) {
  const { role, id } = params;
  return <ClientsDetailed clientId={id} />;
}
