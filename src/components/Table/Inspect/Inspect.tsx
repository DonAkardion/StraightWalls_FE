"use client";

import React from "react";
import { Pen, Trash } from "../../../../public/icons";

interface Field<T> {
  label: string;
  value: (item: T) => React.ReactNode;
}

interface InspectProps<T> {
  item: T;
  fields: Field<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  getId: (item: T) => string;
}

export function Inspect<T>({
  item,
  fields,
  onEdit,
  onDelete,
  getId,
}: InspectProps<T>) {
  const id = getId(item);

  return (
    <div className="flex justify-between items-start bg-white border-b pb-[10px]">
      {/* Left column: fields */}
      <div className="flex flex-col gap-2 ml-[10px]">
        {fields.map(({ label, value }, index) => (
          <div key={index} className="text-sm">
            <span className="font-medium">{label}: </span>
            <span>{value(item)}</span>
          </div>
        ))}
      </div>

      {/* Right column: actions */}
      {(onEdit || onDelete) && (
        <div className="flex flex-col pr-[10px] gap-4 mt-1">
          {onDelete && (
            <img
              src={Trash.src}
              alt="Delete"
              className="w-[21px] h-[21px] cursor-pointer"
              onClick={() => onDelete(id)}
            />
          )}
          {onEdit && (
            <img
              src={Pen.src}
              alt="Edit"
              className="w-[21px] h-[21px] cursor-pointer"
              onClick={() => onEdit(item)}
            />
          )}
        </div>
      )}
    </div>
  );
}
