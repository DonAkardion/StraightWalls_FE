import React, { useEffect, useState } from "react";
import burgerTable from "../../../../public/icons/BurgerTable.svg";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { getProjects } from "@/api/projects";
import { useUser } from "@/context/UserContextProvider";

interface Material {
  id: number;
  name: string;
  quantity: string;
  unitPrice: string;
  supplier: string;
  icon: string;
}

const columns = [
  { key: "name", label: "Назва" },
  { key: "quantity", label: "Кількість" },
  { key: "unitPrice", label: "Вартість од." },
  { key: "supplier", label: "Постачальник" },
  {
    key: "icon",
    label: (
      <img src={burgerTable.src} alt="icon" style={{ width: 25, height: 25 }} />
    ),
  },
];

export function MaterialsTable() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { token } = useUser();
  
  useEffect(() => {
    if (!token) return;

    const fetchMaterials = async () => {
      try {
        const response = await getProjects(token);

        const formattedData: Material[] = response.flatMap((project) =>
          project.materials.map((mat) => ({
            id: mat.id,
            name: mat.name,
            quantity: String(Math.round(Number(mat.remaining_stock))),
            unitPrice: String(mat.selling_price),
            supplier: "ТОВ компанія",
            icon: "",
          }))
        );

        setMaterials(formattedData);
      } catch (error) {
        console.error("Помилка при завантаженні матеріалів:", error);
      }
    };

    fetchMaterials();
  }, [token]);

  return (
    <div className="mt-15">
      <Table<Material>
        title="Кількість матеріалів"
        data={materials}
        expandedId={expandedId}
        columns={columns}
        showIndex={true}
        className="reportsMaterialsWrap"
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        renderInspection={(data) => (
          <Inspect<Material>
            item={data}
            getId={(item) => item.id}
            fields={[
              {
                label: "Вартість од.",
                value: (item) => item.unitPrice,
              },
              {
                label: "Постачальник",
                value: (item) => item.supplier,
              },
            ]}
          />
        )}
      />
    </div>
  );
}
