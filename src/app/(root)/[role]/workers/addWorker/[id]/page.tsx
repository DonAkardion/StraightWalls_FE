import AddCrewForm from "@/components/AddCrew/AddCrewForm";
import { CrewProvider } from "@/features/addWorker/addWorkerContext";

interface Props {
  params: {
    id: string;
    role: string;
  }
}

export default async function AddWorker({ params }: Props) {
  const awaitedProps = await params
  return (
    <>
      <AddCrewForm />
    </>
  );
}
