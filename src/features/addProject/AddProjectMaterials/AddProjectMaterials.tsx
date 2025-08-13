"use client";
import Link from "next/link";
import React from "react";
import styles from "./AddProjectMaterials.module.css";
import { useParams } from "next/navigation";
import { MaterialsEditor } from "@/components/addProject/MaterialsEditor/MaterialsEditor";
import { PaymentDetails } from "@/components/Project/ProjectsDetailed/ProjectPayment/PaymentDetails/PaymentDetails";
import { MaterialIncomeEditor } from "@/components/addProject/MaterialIncomeEditor/MaterialIncomeEditor";
import { mockMaterialsIncome } from "@/mock/Materials/materialsIncomeMock";

export function AddProjectMaterials() {
  const params = useParams();
  const role = params.role as string;
  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <MaterialsEditor />
      <MaterialIncomeEditor
        materialsIncome={mockMaterialsIncome}
        editable={true}
        onMaterialsIncomeChange={() => {}}
        tableClassName="projectMaterialsIncomeEditorWrap"
      />
      <div className={`${styles.materialPayment} my-[40px] md:my-[100px] `}>
        <PaymentDetails
          items={[{ label: "Аванс за матеріали", value: "20 057,5 грн" }]}
        />
      </div>

      <button
        className={`${styles.nextPageBtn} h-[80px] w-full cursor-pointer rounded-[5px]`}
      >
        <Link href={`/${role}/addProject/addProjectCrew`}>Відправити</Link>
      </button>
    </section>
  );
}
