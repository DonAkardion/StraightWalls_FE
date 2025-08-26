"use client";

import React, { useState } from "react";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { MaterialIncomeRow } from "@/types/projectComponents";

interface Props {
  materials: MaterialIncomeRow[];
  showHeader?: boolean;
  className?: string;
  enableTooltips?: boolean;
}

export const MaterialIncomeTable = ({
  materials,
  showHeader = true,
  className,
  enableTooltips = true,
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div>
      <Table<MaterialIncomeRow>
        data={materials}
        className={className}
        showIndex={true}
        showHeader={showHeader}
        expandedId={expandedId}
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        enableTooltips={enableTooltips}
        columns={[
          {
            key: "name",
            label: "Назва матеріалу",
            tooltip: (i) => i.description || i.name,
          },
          { key: "sum", label: "Сума", render: (i) => i.sum.toFixed(2) },
          {
            key: "quantity",
            label: "Кількість",
            render: (i) => `${i.quantity} ${i.unit ?? ""}`,
          },
          {
            key: "income",
            label: "Заробіток",
            render: (i) => i.income.toFixed(2),
          },
        ]}
        renderInspection={(i) => (
          <Inspect<MaterialIncomeRow>
            item={i}
            getId={(item) => item.id}
            fields={[
              { label: "Сума", value: (item) => item.sum },
              { label: "Заробіток", value: (item) => item.income },
            ]}
          />
        )}
      />
    </div>
  );
};
