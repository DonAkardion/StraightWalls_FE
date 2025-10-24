"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Table } from "@/components/Table/Table";
import { Inspect } from "@/components/Table/Inspect/Inspect";
import { NumericInputWithControls } from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterialsTable/NumericInputWithControls";
import { FormModal } from "@/components/Table/Form/FormModal";
import styles from "@/components/Project/ProjectsDetailed/ProjectMaterials/ProjectMaterialsTable/ProjectMaterialsTable.module.css";

interface FakeMaterial {
  id: number;
  name: string;
  unit: string;
  base_price: number;
  quantity: number;
}

interface Props {
  area: number;
  editable?: boolean;
  viewMode?: boolean;
  onChange?: (data: {
    name: string;
    unit: string;
    price: number;
    quantity: number;
    sum: number;
  }) => void;
}

export const FakeMaterialTable = ({
  area,
  editable = false,
  viewMode = false,
  onChange,
}: Props) => {
  const [price, setPrice] = useState<number>(235);
  const [quantity, setQuantity] = useState<number>(area);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // modal edit (for viewMode)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ price: 0, quantity: 0 });

  useEffect(() => {
    if (area > 0) setQuantity(area);
  }, [area]);

  const safeNum = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const getValue = (field: string, fallback: number): number => {
    const raw = inputValues[field];
    return raw !== undefined ? safeNum(raw) : fallback;
  };

  const getInputValue = (field: string, fallback: number): string =>
    inputValues[field] ?? fallback.toString();

  const handleInputChange = (field: string, val: string) => {
    setInputValues((prev) => ({ ...prev, [field]: val }));
    if (field === "price") {
      const num = Math.max(0, Number(val));
      if (!isNaN(num)) setPrice(num);
    }
    if (field === "quantity") {
      const num = Math.max(0, Number(val));
      if (!isNaN(num)) setQuantity(num);
    }
  };

  const fakeMaterial: FakeMaterial = useMemo(
    () => ({
      id: 9999,
      name: "Матеріал на квадрат",
      unit: "м²",
      base_price: price,
      quantity,
    }),
    [price, quantity]
  );

  const sum = useMemo(() => price * quantity, [price, quantity]);

  useEffect(() => {
    onChange?.({
      name: fakeMaterial.name,
      unit: fakeMaterial.unit,
      price,
      quantity,
      sum,
    });
  }, [price, quantity]);

  const handleConfirm = () => setIsConfirmed((prev) => !prev);

  const openEditModal = () => {
    setEditForm({ price, quantity });
    setIsEditModalOpen(true);
  };

  const saveEdit = () => {
    setPrice(editForm.price);
    setQuantity(editForm.quantity);
    setIsEditModalOpen(false);
  };

  const isValid = editForm.price > 0 && editForm.quantity > 0;

  return (
    <section className={`${styles.sectionEstimate} `}>
      <h2
        className={`${styles.estimateTytle} mb-[26px] sm:mb-[10px] md:mb-[16px]`}
      >
        Матеріал
      </h2>
      <Table<FakeMaterial>
        data={[fakeMaterial]}
        showIndex
        className="fakeMaterialTable"
        expandedId={expandedId}
        onInspect={(item) =>
          setExpandedId((prev) => (prev === item.id ? null : item.id))
        }
        onEdit={viewMode ? openEditModal : undefined}
        columns={[
          { key: "name", label: "Назва матеріалу", render: (m) => m.name },
          {
            key: "base_price",
            label: "Ціна, грн",
            render: (m) =>
              editable && !isConfirmed ? (
                <input
                  type="number"
                  min={0}
                  value={getInputValue("price", m.base_price)}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={`${styles.editInput} md:w-16 w-[100px] text-center rounded px-1 py-0`}
                />
              ) : (
                <span className={isConfirmed ? "text-green-600" : ""}>
                  {getValue("price", m.base_price)}
                </span>
              ),
          },
          {
            key: "quantity",
            label: "Кількість",
            render: (m) =>
              editable && !isConfirmed ? (
                <NumericInputWithControls
                  materialId={m.id}
                  field="quantity"
                  value={String(quantity)}
                  fallback={0}
                  onInputChange={(_, __, val) =>
                    setQuantity(Math.max(0, Number(val)))
                  }
                  onStepChange={(_, __, val) => setQuantity(Math.max(0, val))}
                />
              ) : (
                <span className={isConfirmed ? "text-green-600" : ""}>
                  {m.quantity}
                </span>
              ),
          },
          { key: "unit", label: "Од. вимір.", render: (m) => m.unit },
          {
            key: "sum",
            label: "Сума, грн",
            render: () => <span>{sum.toFixed(2)}</span>,
          },
        ]}
        renderInspection={(m) => (
          <Inspect<FakeMaterial>
            item={m}
            getId={(item) => item.id}
            fields={[
              { label: "Од. вимір.", value: (item) => item.unit },
              { label: "Сума, грн", value: () => sum.toFixed(2) },
            ]}
          />
        )}
      />
      {editable && (
        <div className="w-full flex justify-center">
          <div
            className={`${styles.confirmButton} ${
              isConfirmed ? styles.confirmed : ""
            } flex rounded-[5px] md:mt-[40px] md:mb-[40px] mb-[20px] mt-[20px] w-full max-w-[360px] h-[50px] items-center justify-center cursor-pointer`}
          >
            <button
              onClick={handleConfirm}
              className="w-full h-full flex items-center justify-center text-center"
            >
              {isConfirmed ? "Редагувати" : "Підтвердити"}
            </button>
          </div>
        </div>
      )}
      {/* Modal for view mode */}
      {isEditModalOpen && (
        <FormModal
          title="Редагувати матеріал"
          onClose={() => setIsEditModalOpen(false)}
          onSave={saveEdit}
          isValid={isValid}
        >
          <div className="flex flex-col gap-3 p-4">
            <label>
              Ціна, грн:
              <input
                name="price"
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                className="w-full border-b px-2 py-1 outline-none focus:outline-none focus-visible:outline-none appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
            <label>
              Кількість:
              <input
                name="quantity"
                type="number"
                value={editForm.quantity}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                className="w-full border-b px-2 py-1 outline-none focus:outline-none focus-visible:outline-none appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
          </div>
        </FormModal>
      )}
    </section>
  );
};
