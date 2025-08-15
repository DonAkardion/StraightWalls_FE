import React, { useState } from "react";
import burgerTable from "../../../../public/icons/BurgerTable.svg";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";

interface Material {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
  supplier: string;
  icon: string;
}

const data: Material[] = [
  {
    id: "1",
    name: "Гіпс",
    quantity: "4 т",
    unitPrice: "500 грн",
    supplier: "ТОВ компанія",
    icon: "",
  },
  {
    id: "2",
    name: "Гіпс",
    quantity: "4 т",
    unitPrice: "500 грн",
    supplier: "ТОВ компанія",
    icon: "",
  },
  {
    id: "3",
    name: "Гіпс",
    quantity: "4 т",
    unitPrice: "500 грн",
    supplier: "ТОВ компанія",
    icon: "",
  },
  {
    id: "4",
    name: "Гіпс",
    quantity: "4 т",
    unitPrice: "500 грн",
    supplier: "ТОВ компанія",
    icon: "",
  },
  {
    id: "5",
    name: "Гіпс",
    quantity: "4 т",
    unitPrice: "500 грн",
    supplier: "ТОВ компанія",
    icon: "",
  },
];

const columns = [
  { key: "name", label: "Назва" },
  { key: "quantity", label: "Кількість" },
  { key: "unitPrice", label: "Вартість од." },
  { key: "supplier", label: "Постачальник" },
  {
    key: "icon",
    label: (<img
          src={burgerTable.src}
          alt="icon"
          style={{ width: 25, height: 25 }}
        />),
  },
];

export function MaterialsTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return (
    <div className="mt-15">
      <Table<Material>
        title="Кількість матеріалів"
        data={data}
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
