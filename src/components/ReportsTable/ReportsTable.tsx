import React from "react";
import burgerTable from "../../../public/icons/BurgerTable.svg";
import { Table } from "@/components/Table/Table";

interface Material {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
  supplier: string;
  icon: string;
}

const data: Material[] = [
  { id: "1", name: "Гіпс", quantity: "4 т", unitPrice: "500 грн", supplier: "ТОВ компанія", icon: "" },
  { id: "2", name: "Гіпс", quantity: "4 т", unitPrice: "500 грн", supplier: "ТОВ компанія", icon: "" },
  { id: "3", name: "Гіпс", quantity: "4 т", unitPrice: "500 грн", supplier: "ТОВ компанія", icon: "" },
  { id: "4", name: "Гіпс", quantity: "4 т", unitPrice: "500 грн", supplier: "ТОВ компанія", icon: "" },
  { id: "5", name: "Гіпс", quantity: "4 т", unitPrice: "500 грн", supplier: "ТОВ компанія", icon: "" },
];

const columns = [
  { key: "name", label: "Назва" },
  { key: "quantity", label: "Кількість" },
  { key: "unitPrice", label: "Вартість од." },
  { key: "supplier", label: "Постачальник" },
  {
    key: "icon",
    label: (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={burgerTable.src} alt="icon" style={{ width: 25, height: 25 }} />
      </div>
    ),
  },
];

export default function MaterialsTable() {
  return (
    <div className="mt-15">
      <Table<Material>
        title="Кількість матеріалів"
        data={data}
        columns={columns}
        showIndex={true}
      />
    </div>
  );
}
