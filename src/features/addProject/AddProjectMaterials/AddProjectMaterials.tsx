"use client";
import Link from "next/link";
import React from "react";
import styles from "./AddProjectMaterials.module.css";
import { useParams } from "next/navigation";
import { MaterialsEditor } from "@/components/addProject/MaterialsEditor/MaterialsEditor";
import { PaymentDetails } from "@/components/Project/ProjectsDetailed/ProjectPayment/PaymentDetails/PaymentDetails";
import { MaterialIncomeEditor } from "@/components/addProject/MaterialIncomeEditor/MaterialIncomeEditor";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import { ProjectMaterial } from "@/types/projectComponents";

export function AddProjectMaterials() {
  const params = useParams();
  const role = params.role as string;

  // беремо матеріали з контексту
  const { materials, setMaterials } = useProjectCreation();

  const handleAddMaterial = (material: ProjectMaterial) => {
    setMaterials([...materials, { ...material, id: Date.now() }]);
  };

  const handleUpdateMaterial = (id: number, updated: ProjectMaterial) => {
    setMaterials(materials.map((m) => (m.id === id ? updated : m)));
  };

  const handleDeleteMaterial = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div className="relative">
        <MaterialsEditor
          editable={true}
          tablesTytle="Матеріали"
          materials={materials}
          onAdd={handleAddMaterial}
          onUpdate={handleUpdateMaterial}
          onDelete={handleDeleteMaterial}
        />
        <span
          className={`${styles.clientsDownloadPDF} absolute top-[10px] right-[5px] md:top-[26px] md:right-[5px] cursor-pointer`}
        >
          Завантажити PDF
        </span>
      </div>

      <MaterialIncomeEditor
        materials={materials}
        tableClassName="projectMaterialsIncomeEditorWrap"
        tablesTytle="Заробіток на матеріалах"
      />

      <div className={`${styles.materialPayment} my-[40px] md:my-[100px] `}>
        <PaymentDetails
          items={[{ label: "Аванс за матеріали", value: "20 057,5 грн" }]}
        />
      </div>

      <Link
        href={`/${role}/addProject/addProjectCrew`}
        className={`${styles.nextPageBtn} flex items-center justify-center h-[80px] w-full cursor-pointer rounded-[5px]`}
      >
        Відправити
      </Link>
    </section>
  );
}
