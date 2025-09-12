"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContextProvider";
import { Material } from "@/types/material";
import { MaterialsList } from "@/components/Settings/MaterialSettings/MaterialList";
import { FormModal } from "@/components/Table/Form/FormModal";
import { MaterialFormModal } from "@/components/Settings/MaterialSettings/MaterialFormModal";
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "@/api/material";

export function MaterialSettings() {
  const { token } = useUser();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentForm, setCurrentForm] = useState<Material | null>(null);

  const [formValid, setFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Завантаження всіх матеріалів
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getMaterials(token);
        setMaterials(data);
      } catch (err) {
        console.error("Помилка при завантаженні матеріалу:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const openAddModal = () => {
    const draft: Omit<
      Material,
      "id" | "created_at" | "updated_at" | "base_margin"
    > = {
      name: "",
      base_purchase_price: 0,
      base_selling_price: 0,
      unit: "",
      stock: 0,
      base_delivery: 0,
    };
    setCurrentForm(draft as Material);
    setFormValid(false);
    setSubmitted(false);
  };

  const openEditModal = (material: Material) => {
    setCurrentForm(material);
    setFormValid(true);
    setSubmitted(false);
  };

  const handledeleteMaterial = async (id: number) => {
    if (!token) return;
    try {
      await deleteMaterial(token, id);
      setMaterials((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Помилка при видаленні матеріалу:", err);
    }
  };

  const saveMaterial = async (material: Material) => {
    if (!token) return;

    try {
      let saved: Material;

      if (material.id) {
        const { id, ...updates } = material;
        saved = await updateMaterial(token, id, updates);
        setMaterials((prev) => prev.map((s) => (s.id === id ? saved : s)));
      } else {
        const { ...payload } = material;
        saved = await createMaterial(
          token,
          payload as Omit<
            Material,
            "id" | "created_at" | "updated_at" | "base_margin"
          >
        );
        setMaterials((prev) => [...prev, saved]);
      }

      setCurrentForm(null);
    } catch (err) {
      console.error("Помилка при збереженні матеріалу:", err);
    }
  };

  const isValid =
    !!currentForm?.name &&
    !!currentForm?.base_purchase_price &&
    !!currentForm?.base_selling_price &&
    !!currentForm?.unit &&
    !!currentForm?.stock &&
    Number(currentForm.base_purchase_price) > 0 &&
    Number(currentForm.base_selling_price) > 0;

  if (loading) {
    return <div className="p-4 text-center">Завантаження...</div>;
  }

  return (
    <section
      className={`relative max-w-[1126px] m-auto md:pt-[60px] md:pr-[80px] md:pl-[60px] md:pb-[40px] pt-[40px] pr-[14px] pb-[74px] pl-[26px] `}
    >
      <div className="mb-[40px] md:mb-[60px]">
        <MaterialsList
          materials={materials}
          onAdd={() => openAddModal()}
          onEdit={openEditModal}
          onDelete={(id) => handledeleteMaterial(id)}
        />
      </div>
      {currentForm && (
        <FormModal
          title={currentForm.id ? "Редагувати Матеріал" : "Новий Матеріал"}
          onClose={() => {
            setSubmitted(false);
            setCurrentForm(null);
          }}
          onSave={() => {
            setSubmitted(true);
            if (formValid) {
              saveMaterial(currentForm);
            }
          }}
        >
          <MaterialFormModal
            material={currentForm}
            onChange={(updated, valid) => {
              setCurrentForm(updated);
              setFormValid(valid);
            }}
            submitted={submitted}
          />
        </FormModal>
      )}
    </section>
  );
}
