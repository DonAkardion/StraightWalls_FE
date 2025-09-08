"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import styles from "./AddProjectMaterials.module.css";
import { useParams } from "next/navigation";
import { ProjectMaterials } from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterials";
import { PaymentDetails } from "@/components/Project/ProjectsDetailed/ProjectPayment/PaymentDetails/PaymentDetails";
import { MaterialIncomeEditor } from "@/components/addProject/MaterialIncomeEditor/MaterialIncomeEditor";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import { getMaterials } from "@/api/material";
import { MaterialWithQuantity } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import { useUser } from "@/context/UserContextProvider";

export function AddProjectMaterials() {
  const { token } = useUser();
  const params = useParams();
  const role = params.role as string;
  const { materials, setMaterials, advanceAmount } = useProjectCreation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSelection, setLocalSelection] =
    useState<MaterialWithQuantity[]>(materials);

  const didInitRef = useRef(false);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const fetchMaterials = async () => {
      if (!token) {
        setError("Немає токена для авторизації");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const materialsData = await getMaterials(token);

        // додаємо quantity
        const materialsWithQuantity: MaterialWithQuantity[] = materialsData.map(
          (m) => ({ ...m, quantity: 0 })
        );

        setMaterials(materialsWithQuantity);
        setLocalSelection(materialsWithQuantity);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити матеріали");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [token, setMaterials]);

  useEffect(() => {
    setMaterials(localSelection);
  }, [localSelection, setMaterials]);

  const handleSelectionChange = (
    updated: { materialId: number; quantity: number }[]
  ) => {
    const newMaterials: MaterialWithQuantity[] = materials.map((m) => {
      const found = updated.find((u) => u.materialId === m.id);

      if (!found) return m;

      return { ...m, quantity: found.quantity };
    });

    setMaterials(newMaterials);
  };

  if (loading) return <div>Завантаження матеріалів...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[30px] md:pb-[250px] pr-[20px] md:pt-[66px] md:pl-[80px] md:pr-[60px]`}
    >
      <div className="relative">
        <ProjectMaterials
          editable={true}
          tablesTitle="Матеріали"
          materials={materials}
          onSelectionChange={handleSelectionChange}
          tableClassName="projectAddMaterialsTableWrap"
        />
        {materials.length > 0 && (
          <span
            className={`${styles.clientsDownloadPDF} absolute top-[10px] right-[5px] md:top-[26px] md:right-[5px] cursor-pointer`}
          >
            Завантажити PDF
          </span>
        )}
      </div>

      <MaterialIncomeEditor
        materials={materials}
        tableClassName="projectMaterialsIncomeEditorWrap"
        tablesTytle="Заробіток на матеріалах"
      />

      <div className={`${styles.materialPayment} my-[40px] md:my-[100px] `}>
        <PaymentDetails
          items={[
            { label: "Аванс за матеріали", value: `${advanceAmount} грн` },
          ]}
          editable
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
