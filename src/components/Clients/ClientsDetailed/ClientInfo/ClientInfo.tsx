import React from "react";
type InfoItemProps = {
  icon: string;
  label: string;
};

export const ClientInfoItem = ({ icon, label }: InfoItemProps) => (
  <div className="flex items-center gap-2">
    {icon && (
      <img
        src={icon}
        alt={label}
        className="w-5 h-5 object-contain cursor-pointer"
      />
    )}
    <p className="text-black text-[14px]">{label}</p>
  </div>
);
